@echo off
echo Iniciando refatoracao do Frontend...

cd src\screens

mkdir Agua Ajuda AlterarSenha Dicas Energia EsqueciSenha Home Login Perfil Privacidade Register Relatorios 2>nul

git mv AguaScreen.js Agua\index.js
git mv AjudaScreen.js Ajuda\index.js
git mv AlterarSenhaScreen.js AlterarSenha\index.js
git mv DicasScreen.js Dicas\index.js
git mv EnergiaScreen.js Energia\index.js
git mv EsqueciSenhaScreen.js EsqueciSenha\index.js
git mv HomeScreen.js Home\index.js
git mv LoginScreen.js Login\index.js
git mv PerfilScreen.js Perfil\index.js
git mv PrivacidadeScreen.js Privacidade\index.js
git mv RegisterScreen.js Register\index.js
git mv RelatoriosScreen.js Relatorios\index.js

cd ..\..
rmdir /s /q src\pages

echo Refatoracao concluida!
pause
