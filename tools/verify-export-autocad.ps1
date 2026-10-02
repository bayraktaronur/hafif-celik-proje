# Run after tests/plan-export.cjs and tests/cad-export.cjs. Opens only generated DXF fixtures, never user drawings.
$ErrorActionPreference='Stop'
$cad='C:/Program Files/Autodesk/AutoCAD 2021/accoreconsole.exe'
if (!(Test-Path -LiteralPath $cad)) {throw 'AutoCAD Core Console 2021 is required for this integration check.'}
$base=(Get-Location).Path
foreach($name in @('tuna','furniture','simple','detail')) {
  $target="artifacts/export/$name-cad-check.txt"
  $script=@'
(vl-load-com)
(setq o (open "RESULT" "w"))
(write-line (strcat "UNITS=" (itoa (getvar "INSUNITS"))) o)
(setq ss (ssget "_X"))
(write-line (strcat "ENTITIES=" (itoa (sslength ss))) o)
(setq i 0)
(repeat (sslength ss) (setq data (entget (ssname ss i))) (write-line (vl-prin1-to-string data) o) (setq i (1+ i)))
(setq dims (ssget "_X" '((0 . "DIMENSION"))))
(write-line (strcat "NATIVE_DIMENSIONS=" (if dims (itoa (sslength dims)) "0")) o)
(setq hats (ssget "_X" '((0 . "HATCH"))))
(write-line (strcat "NATIVE_HATCHES=" (if hats (itoa (sslength hats)) "0")) o)
(write-line (strcat "DIMLFAC=" (rtos (cdr (assoc 144 (tblsearch "DIMSTYLE" "PS_CM"))) 2 3)) o)
(setq de (ssname dims 0) dd (entget de) p (cdr (assoc 13 dd)) q (cdr (assoc 14 dd)) old (distance p q))
(setq unit (mapcar '(lambda (a b) (/ (- b a) old)) p q) new (mapcar '(lambda (a b) (+ a (* 100 b))) q unit))
(entmod (subst (cons 14 new) (assoc 14 dd) dd))
(entupd de)
_.REGEN
(setq child (tblobjname "BLOCK" (cdr (assoc 2 (entget de)))))
(while child (setq cd (entget child)) (if (member (cdr (assoc 0 cd)) '("TEXT" "MTEXT")) (write-line (strcat "DIM_TEXT=" (cdr (assoc 1 cd))) o)) (setq child (entnext child)))
(write-line (strcat "EDIT_VALUES=" (rtos old 2 4) "/" (rtos (cdr (assoc 42 (entget de))) 2 4)) o)
(write-line (strcat "DIMENSION_EDIT_OK=" (if (< (abs (- (cdr (assoc 42 (entget de))) (* (+ old 100) 0.1))) 0.001) "1" "0")) o)
(close o)
_.AUDIT
_N
_.QUIT
_Y
'@
  $script.Replace('RESULT',$target) | Set-Content -LiteralPath "artifacts/export/$name-check.scr" -Encoding ascii
  & $cad /i "$base/artifacts/export/$name.dxf" /s "$base/artifacts/export/$name-check.scr" /l en-US *> "artifacts/export/$name-cad.log"
  if($LASTEXITCODE -ne 0 -or !(Test-Path -LiteralPath $target)){throw "AutoCAD DXF failed: $name"}
  $result=Get-Content -LiteralPath $target -TotalCount 2
  if($result[0] -ne 'UNITS=4' -or $result[1] -notmatch '^ENTITIES=[1-9][0-9]*$'){throw "Incorrect AutoCAD DXF data: $name"}
  $log=Get-Content -LiteralPath "artifacts/export/$name-cad.log" -Encoding Unicode -Raw
  if($log -notmatch 'Total errors found 0 fixed 0'){throw "AutoCAD audit did not confirm zero errors: $name"}
  $all=Get-Content -LiteralPath $target -Raw
  if($all -notmatch 'NATIVE_DIMENSIONS=[1-9][0-9]*' -or $all -notmatch 'NATIVE_HATCHES=[1-9][0-9]*' -or $all -notmatch 'DIMLFAC=0.1' -or $all -notmatch 'DIMENSION_EDIT_OK=1'){throw "Missing native dimensions/hatches/cm style: $name"}
  Write-Output "$name : $($result -join ', ')"
}

