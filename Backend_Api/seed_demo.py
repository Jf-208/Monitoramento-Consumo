# seed_demo.py
# Script de demonstração para a banca acadêmica.
# Insere dados realistas de 14 dias de consumo para um usuário de demonstração,
# permitindo que os gráficos e estatísticas do app sejam exibidos com dados reais.
#
# Como executar (dentro da pasta Backend_Api/):
#   python seed_demo.py
#
# Pré-requisito: o banco de dados já deve existir (rode o app ou uvicorn ao menos uma vez).

import os
import sys
import random
from datetime import datetime, timedelta, timezone

# Garante que o Python encontre os módulos do projeto (src/)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy.orm import Session
from src.database.connection import SessionLocal, criar_tabelas
from src.models.models import Usuario, Consumo
from src.core.security import hash_senha


# ─── CONFIGURAÇÕES DO USUÁRIO DEMO ───────────────────────────────────────────

DEMO_NOME  = "Demo Banca"
DEMO_EMAIL = "demo@wavunder.app"
DEMO_SENHA = "Demo@2025"


# ─── RANGES DE CONSUMO REALISTAS ─────────────────────────────────────────────

# Água: consumo diário de banho (litros)
AGUA_MIN, AGUA_MAX = 60, 120

# Energia: consumo diário (kWh)
ENERGIA_MIN, ENERGIA_MAX = 0.8, 2.5

# Vampiro: consumo stand-by diário (kWh)
VAMPIRO_MIN, VAMPIRO_MAX = 0.2, 0.5


def criar_usuario_demo(db: Session) -> Usuario:
    """
    Busca ou cria o usuário de demonstração no banco de dados.
    Se já existir, apenas retorna o usuário existente sem duplicar.
    """
    usuario = db.query(Usuario).filter(Usuario.email == DEMO_EMAIL).first()

    if usuario:
        print(f"✅ Usuário demo já existe (id={usuario.id}). Pulando criação.")
        return usuario

    usuario = Usuario(
        nome=DEMO_NOME,
        email=DEMO_EMAIL,
        senha=hash_senha(DEMO_SENHA),
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    print(f"✅ Usuário demo criado com sucesso (id={usuario.id})")
    return usuario


def limpar_consumos_demo(db: Session, id_usuario: int):
    """
    Remove registros de consumo antigos do usuário demo para evitar duplicatas
    ao rodar o script mais de uma vez.
    """
    deletados = db.query(Consumo).filter(Consumo.id_usuario == id_usuario).delete()
    db.commit()
    if deletados > 0:
        print(f"🗑️  {deletados} registros antigos removidos.")


def inserir_consumos_demo(db: Session, id_usuario: int):
    """
    Insere 14 dias de consumo realista para o usuário demo.
    Os dados cobrem as últimas 2 semanas para preencher bem os gráficos.
    """
    agora = datetime.now(timezone.utc)
    registros = []

    print(f"\n📊 Gerando dados de consumo para os últimos 14 dias...\n")

    for dias_atras in range(14, 0, -1):
        data_base = agora - timedelta(days=dias_atras)
        dia_str   = data_base.strftime('%d/%m')

        # ── ÁGUA: 1 registro por dia (simulação de banho) ──────────────────
        litros = round(random.uniform(AGUA_MIN, AGUA_MAX), 2)
        registros.append(Consumo(
            id_usuario    = id_usuario,
            tipo_consumo  = "agua",
            valor         = litros,
            unidade_medida= "L",
            is_simulado   = True,
            data_registro = data_base.replace(hour=7, minute=30),  # horário de banho matinal
        ))
        print(f"  [{dia_str}] 💧 Água:    {litros} L")

        # ── ENERGIA: 1 registro por dia (uso do chuveiro/aparelhos) ────────
        kwh_energia = round(random.uniform(ENERGIA_MIN, ENERGIA_MAX), 4)
        registros.append(Consumo(
            id_usuario    = id_usuario,
            tipo_consumo  = "energia",
            valor         = kwh_energia,
            unidade_medida= "kWh",
            is_simulado   = True,
            data_registro = data_base.replace(hour=8, minute=0),
        ))
        print(f"  [{dia_str}] ⚡ Energia: {kwh_energia} kWh")

        # ── VAMPIRO: apenas nos últimos 7 dias (stand-by) ──────────────────
        if dias_atras <= 7:
            kwh_vampiro = round(random.uniform(VAMPIRO_MIN, VAMPIRO_MAX), 4)
            registros.append(Consumo(
                id_usuario    = id_usuario,
                tipo_consumo  = "vampiro",
                valor         = kwh_vampiro,
                unidade_medida= "kWh",
                is_simulado   = True,
                data_registro = data_base.replace(hour=23, minute=0),  # stand-by noturno
            ))
            print(f"  [{dia_str}] 🧛 Vampiro: {kwh_vampiro} kWh")

        print()

    # Insere todos de uma vez (mais eficiente)
    db.add_all(registros)
    db.commit()
    print(f"✅ {len(registros)} registros inseridos com sucesso!")


def exibir_resumo(db: Session, id_usuario: int):
    """Exibe um resumo dos dados inseridos para confirmação visual."""
    todos = db.query(Consumo).filter(Consumo.id_usuario == id_usuario).all()

    total_agua    = sum(float(r.valor) for r in todos if r.tipo_consumo == "agua")
    total_energia = sum(float(r.valor) for r in todos if r.tipo_consumo == "energia")
    total_vampiro = sum(float(r.valor) for r in todos if r.tipo_consumo == "vampiro")

    print("\n" + "═" * 45)
    print("  RESUMO DOS DADOS DE DEMONSTRAÇÃO")
    print("═" * 45)
    print(f"  👤 Usuário: {DEMO_NOME}")
    print(f"  📧 E-mail:  {DEMO_EMAIL}")
    print(f"  🔑 Senha:   {DEMO_SENHA}")
    print("─" * 45)
    print(f"  💧 Água total (14 dias):    {total_agua:.2f} L")
    print(f"  ⚡ Energia total (14 dias): {total_energia:.4f} kWh")
    print(f"  🧛 Vampiro total (7 dias):  {total_vampiro:.4f} kWh")
    print(f"  📝 Total de registros:      {len(todos)}")
    print("═" * 45)
    print("\n  ✅ Pronto! Use as credenciais acima para")
    print("     fazer login no app durante a banca.\n")


# ─── EXECUÇÃO PRINCIPAL ───────────────────────────────────────────────────────

if __name__ == "__main__":
    print("\n🌊 WAVUNDER — Script de Seed para Demonstração")
    print("=" * 45)

    # Garante que as tabelas existam antes de inserir
    criar_tabelas()
    print("✅ Tabelas verificadas/criadas.")

    db: Session = SessionLocal()
    try:
        # 1. Cria (ou recupera) o usuário demo
        usuario = criar_usuario_demo(db)

        # 2. Limpa registros anteriores para evitar duplicatas
        limpar_consumos_demo(db, usuario.id)

        # 3. Insere 14 dias de dados realistas
        inserir_consumos_demo(db, usuario.id)

        # 4. Exibe resumo final
        exibir_resumo(db, usuario.id)

    except Exception as e:
        db.rollback()
        print(f"\n❌ Erro durante o seed: {e}")
        raise

    finally:
        db.close()
