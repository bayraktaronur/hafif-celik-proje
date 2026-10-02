# Run after tests/plan-export.cjs. Opens only generated DXF fixtures, never user drawings.
$ErrorActionPreference='Stop'
$cad='C:/Program Files/Autodesk/AutoCAD 2021/accoreconsole.exe'
if (!(Test-Path -LiteralPath $cad)) {throw 'AutoCAD Core Console 2021 is required for this integration check.'}
$base=(Get-Location).Path
foreach($name in @('tuna','furniture')) {
  $target="artifacts/export/$name-cad-check.txt"
  $script=@'
(vl-load-com)
(setq o (open "RESULT" "w"))
(write-line (strcat "UNITS=" (itoa (getvar "INSUNITS"))) o)
(setq ss (ssget "_X"))
(write-line (strcat "ENTITIES=" (itoa (sslength ss))) o)
(setq i 0)
(repeat (sslength ss) (setq data (entget (ssname ss i))) (write-line (vl-prin1-to-string data) o) (setq i (1+ i)))
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
  Write-Output "$name : $($result -join ', ')"
}
