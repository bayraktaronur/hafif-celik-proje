# Session-only loopback reader. No global environment changes or cloud use.
$ErrorActionPreference='Stop'
$ollamaExe=Join-Path $env:LOCALAPPDATA 'Programs/Ollama/ollama.exe'
if(!(Test-Path -LiteralPath $ollamaExe)){throw 'Önce resmî Ollama kurulumunu tamamlayın: https://ollama.com/download/windows'}
$nodeCmd=Get-Command node -ErrorAction SilentlyContinue
$nodeExe=if($nodeCmd){$nodeCmd.Source}else{Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'}
if(!(Test-Path -LiteralPath $nodeExe)){throw 'Yerel okuyucu köprüsü için Node.js gerekli.'}
$env:OLLAMA_HOST='127.0.0.1:11436'
$env:OLLAMA_NO_CLOUD='1'
if(!(Get-NetTCPConnection -LocalPort 11436 -State Listen -ErrorAction SilentlyContinue)){Start-Process -FilePath $ollamaExe -ArgumentList 'serve' -WindowStyle Hidden}
if(!(Get-NetTCPConnection -LocalPort 11435 -State Listen -ErrorAction SilentlyContinue)){Start-Process -FilePath $nodeExe -ArgumentList ('"'+(Join-Path $PSScriptRoot 'local-plan-reader.cjs')+'"') -WindowStyle Hidden}
Write-Output 'Yerel okuyucu başlatıldı. Yönetim APIsi tarayıcıya açılmaz. Model qwen3-vl:8b-instruct kurulu olmalıdır.'
