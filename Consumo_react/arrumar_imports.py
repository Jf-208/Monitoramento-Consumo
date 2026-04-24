import glob
import os

print("Corrigindo os níveis de importação nas telas...")

# Busca todos os arquivos index.js dentro das pastas das telas
files = glob.glob("src/screens/**/index.js", recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Como as telas desceram 1 nível de pasta (foram para dentro de suas próprias pastas),
    # todos os imports relativos precisam subir 1 nível extra (de ../ para ../../)
    new_content = content.replace("../contexts/", "../../contexts/")
    new_content = new_content.replace("../components/", "../../components/")
    new_content = new_content.replace("../styles/", "../../styles/")
    new_content = new_content.replace("../services/", "../../services/")
    new_content = new_content.replace("../utils/", "../../utils/")
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  [OK] Corrigido: {file}")

print("\nFeito! Agora o Expo vai conseguir achar todos os arquivos.")
