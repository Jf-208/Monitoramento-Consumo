from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from banco_de_dados import criar_tabelas
from rotas.v1.auth import auth_router

# Ciclo de vida da aplicação
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Cria as tabelas no banco de dados (SQLite local) antes de iniciar
    criar_tabelas()
    yield

app = FastAPI(
    title="API de Monitoramento - Consumo",
    version="1.0.0",
    lifespan=lifespan
)

# CORS: Evita bloqueios ao acessar do frontend (localhost:8081) para o backend (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite tudo para facilitar na banca
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "API em Português no ar!"}

# Incluindo a rota de autenticação (adicione as outras aqui futuramente)
app.include_router(auth_router)

# Comando para rodar: uvicorn principal:app --reload
