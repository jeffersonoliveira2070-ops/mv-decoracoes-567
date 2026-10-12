@echo off
:: Verifica se esta executando como Administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [AVISO] Solicitando permissoes de Administrador...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo =======================================================
echo   Configurando dominio local: mvdecoracoes.local
echo =======================================================
echo.

findstr /i "mvdecoracoes.local" "%WINDIR%\System32\drivers\etc\hosts" >nul
if %errorLevel% equ 0 (
    echo [INFO] O dominio mvdecoracoes.local ja esta cadastrado no seu arquivo hosts!
) else (
    echo 127.0.0.1 mvdecoracoes.local>>"%WINDIR%\System32\drivers\etc\hosts"
    echo [SUCESSO] Entrada adicionada com sucesso no arquivo hosts!
)

ipconfig /flushdns >nul
echo.
echo Pronto! Voce ja pode acessar o site no navegador pelo endereco:
echo http://mvdecoracoes.local:8080
echo.
pause
