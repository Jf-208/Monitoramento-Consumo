import bcrypt

def hash_senha(senha: str) -> str:
    # Transforma a senha em bytes e gera um salt (tempero) único
    salt = bcrypt.gensalt()
    # Cria o hash da senha
    senha_hash = bcrypt.hashpw(senha.encode('utf-8'), salt)
    return senha_hash.decode('utf-8')

def verificar_senha(senha_fornecida: str, senha_hash_banco: str) -> bool:
    # Verifica se a senha fornecida corresponde ao hash que está no banco
    return bcrypt.checkpw(senha_fornecida.encode('utf-8'), senha_hash_banco.encode('utf-8'))
