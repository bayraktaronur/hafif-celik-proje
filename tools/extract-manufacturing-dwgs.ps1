# Run from repository root. Only temporary copies are opened by AutoCAD.
$ErrorActionPreference='Stop'
$cadConsole='C:/Program Files/Autodesk/AutoCAD 2021/accoreconsole.exe'
if (!(Test-Path -LiteralPath $cadConsole)) { throw 'AutoCAD 2021 Core Console required.' }
$inventory=Get-Content 'analizler/2026-10-02-bes-imalat-kaynaklari.json' -Raw | ConvertFrom-Json
$base=(Get-Location).Path
$index=0
foreach($item in $inventory){
  if((Get-FileHash -LiteralPath $item.copy -Algorithm SHA256).Hash -ne $item.sha256){throw "Source hash mismatch: $($item.name)"}
  $dir="artifacts/imalat/$index"
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  Copy-Item -LiteralPath $item.copy -Destination "$dir/source.dwg"
  $script=@'
(vl-load-com)
(defun fmt-tail (x) (cond ((null x) "") ((listp x) (strcat " " (fmt (car x)) (fmt-tail (cdr x)))) (T (strcat " . " (fmt x)))))
(defun fmt (x) (cond ((= (type x) 'REAL) (rtos x 2 12)) ((and x (listp x)) (strcat "(" (fmt (car x)) (fmt-tail (cdr x)) ")")) (T (vl-prin1-to-string x))))
(setq out (open "OUTPUT/entities.lspdata" "w"))
(write-line (vl-prin1-to-string (list "HEADER" (getvar "INSUNITS") (getvar "EXTMIN") (getvar "EXTMAX"))) out)
(setq en (entnext))
(while en (write-line (fmt (entget en)) out) (setq en (entnext en)))
(close out)
(setvar "QAFLAGS" 1)
(repeat 3 (setq ss (ssget "_X" '((0 . "INSERT") (410 . "Model")))) (if ss (command "_.EXPLODE" ss "")))
(setq out (open "OUTPUT/exploded.lspdata" "w") en (entnext))
(while en (write-line (fmt (entget en)) out) (setq en (entnext en)))
(close out)
_.QUIT
_Y
'@
  $script.Replace('OUTPUT',$dir) | Set-Content -Encoding ascii "$dir/extract.scr"
  & $cadConsole /i "$base/$dir/source.dwg" /s "$base/$dir/extract.scr" /l en-US *> "$dir/core-output.log"
  if($LASTEXITCODE -ne 0 -or !(Test-Path "$dir/exploded.lspdata")){throw "Extraction failed: $($item.name)"}
  if((Get-FileHash -LiteralPath $item.copy -Algorithm SHA256).Hash -ne $item.sha256){throw 'Reference modified unexpectedly'}
  Write-Output "Extracted $($item.name)"
  $index++
}
