import os
import subprocess
import glob

# Mapeamento de pastas de componentes
comp_maps = {
    "src/components/basicos": "src/components/basic",
    "src/components/intermediarios": "src/components/intermediate",
    "src/components/layouts": "src/components/layout"
}

# Mapeamento de telas
screen_maps = {
    "src/screens/Agua": "src/screens/Water",
    "src/screens/Ajuda": "src/screens/Help",
    "src/screens/AlterarSenha": "src/screens/ChangePassword",
    "src/screens/Dicas": "src/screens/Tips",
    "src/screens/Energia": "src/screens/Energy",
    "src/screens/EsqueciSenha": "src/screens/ForgotPassword",
    "src/screens/Perfil": "src/screens/Profile",
    "src/screens/Privacidade": "src/screens/Privacy",
    "src/screens/Relatorios": "src/screens/Reports"
}

print("Renomeando pastas usando Git...")
for old, new in {**comp_maps, **screen_maps}.items():
    if os.path.exists(old):
        subprocess.run(["git", "mv", old, new], check=False)
    else:
        print(f"  [AVISO] Pasta não encontrada: {old}")

print("\nAtualizando nomes e imports nos arquivos JS...")
# Dicionário de substituições de texto (caminhos e navegação)
replacements = {
    "components/basicos": "components/basic",
    "components/intermediarios": "components/intermediate",
    "components/layouts": "components/layout",
    "screens/Agua": "screens/Water",
    "screens/Ajuda": "screens/Help",
    "screens/AlterarSenha": "screens/ChangePassword",
    "screens/Dicas": "screens/Tips",
    "screens/Energia": "screens/Energy",
    "screens/EsqueciSenha": "screens/ForgotPassword",
    "screens/Perfil": "screens/Profile",
    "screens/Privacidade": "screens/Privacy",
    "screens/Relatorios": "screens/Reports",
    
    # Atualizando o nome da rota no Stack Navigator
    'name="Agua"': 'name="Water"',
    'name="Ajuda"': 'name="Help"',
    'name="AlterarSenha"': 'name="ChangePassword"',
    'name="Dicas"': 'name="Tips"',
    'name="Energia"': 'name="Energy"',
    'name="EsqueciSenha"': 'name="ForgotPassword"',
    'name="Perfil"': 'name="Profile"',
    'name="Privacidade"': 'name="Privacy"',
    'name="Relatorios"': 'name="Reports"',
    
    # Atualizando a string de navegação (ex: navigation.navigate('Agua'))
    "'Agua'": "'Water'",
    "'Ajuda'": "'Help'",
    "'AlterarSenha'": "'ChangePassword'",
    "'Dicas'": "'Tips'",
    "'Energia'": "'Energy'",
    "'EsqueciSenha'": "'ForgotPassword'",
    "'Perfil'": "'Profile'",
    "'Privacidade'": "'Privacy'",
    "'Relatorios'": "'Reports'"
}

# Percorre todos os arquivos JS
js_files = glob.glob("src/**/*.js", recursive=True)

for file_path in js_files:
    if not os.path.isfile(file_path): continue
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = content
    for old_text, new_text in replacements.items():
        new_content = new_content.replace(old_text, new_text)
    
    if content != new_content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"  [OK] Imports e Nomes corrigidos em: {file_path}")

print("\nFeito! O Frontend foi 100% padronizado para a Arquitetura em Inglês.")
