from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.connection import criar_tabelas
from src.routes.v1.auth_routes import auth_router
from src.routes.v1.consumo_routes import consumo_router
from src.routes.v1.meta_routes import meta_router   # import no topo — falha ruidosamente se houver erro

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

# Routers registrados após o app estar configurado
app.include_router(auth_router)
app.include_router(consumo_router)
app.include_router(meta_router)

# Comando para rodar: uvicorn src.main:app --reload
