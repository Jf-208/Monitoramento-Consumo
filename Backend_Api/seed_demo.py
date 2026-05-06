#!/usr/bin/env python3
"""
seed_demo.py — Popula o banco com dados realistas para demonstração na banca.

Cria 3 usuários com histórico de consumo de 30 dias.
Útil para mostrar gráficos, análises e o nível sustentável funcionando.

Uso:
    cd Backend_Api
    python seed_demo.py

    # Para limpar e recriar:
    python seed_demo.py --reset

USUÁRIOS CRIADOS:
    email: vitor@wavunder.app     senha: demo123
    email: ana@wavunder.app       senha: demo123
    email: pedro@wavunder.app     senha: demo123
"""

import sys
import os
import random
from datetime import datetime, timedelta

# ── Caminho do backend ────────────────────────────────────────────────────────
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

from src.database.connection import SessionLocal, engine
from src.models.base import Base
from src.models.models import Usuario, Consumo
# Reutiliza hash_senha do security.py — mesmo bcrypt direto, sem passlib
# Garante compatibilidade com bcrypt 4+ (que removeu __about__ do passlib)
from src.core.security import hash_senha

# ── Configuração ──────────────────────────────────────────────────────────────

USUARIOS_DEMO = [
    {"nome": "Vitor",  "email": "vitor@wavunder.app",  "senha": "demo123", "perfil": "moderado"},
    {"nome": "Ana",    "email": "ana@wavunder.app",    "senha": "demo123", "perfil": "sustentavel"},
    {"nome": "Pedro",  "email": "pedro@wavunder.app",  "senha": "demo123", "perfil": "alto"},
]

# ── Perfis de consumo ─────────────────────────────────────────────────────────
# Referência: ANEEL e ANA — consumo médio brasileiro
#   Água:    166L/dia por pessoa (SNIS 2022)
#   Energia: 1.5 kWh/dia por pessoa (ANEEL 2023)
PERFIS = {
    "sustentavel": {
        "agua_litros_min": 40,   "agua_litros_max": 90,
        "energia_kwh_min": 0.3,  "energia_kwh_max": 0.8,
        "gasto_rs_min": 5.0,     "gasto_rs_max": 20.0,
    },
    "moderado": {
        "agua_litros_min": 100,  "agua_litros_max": 180,
        "energia_kwh_min": 0.8,  "energia_kwh_max": 2.0,
        "gasto_rs_min": 15.0,    "gasto_rs_max": 50.0,
    },
    "alto": {
        "agua_litros_min": 200,  "agua_litros_max": 350,
        "energia_kwh_min": 2.5,  "energia_kwh_max": 5.0,
        "gasto_rs_min": 40.0,    "gasto_rs_max": 120.0,
    },
}

TIPOS_AGUA    = [("Banho", "L"), ("Pia", "L"), ("Louça", "L"), ("Jardim", "L")]
TIPOS_ENERGIA = [("Chuveiro", "kWh"), ("Ar-condicionado", "kWh"), ("Geladeira", "kWh"), ("TV", "kWh"), ("Computador", "kWh")]
TIPOS_OUTROS  = [("Conta de Água", "R$"), ("Conta de Luz", "R$"), ("GLP (Gás)", "R$")]


def gerar_consumos(id_usuario: int, perfil: str, dias: int = 30) -> list:
    """
    Gera registros de consumo realistas para os últimos `dias` dias.
    Não gera para todos os dias (simula comportamento humano).

    @param id_usuario - FK do usuário no banco
    @param perfil     - 'sustentavel', 'moderado' ou 'alto'
    @param dias       - quantos dias para trás gerar dados
    @returns list     - lista de objetos Consumo prontos para inserção
    """
    cfg = PERFIS[perfil]
    consumos = []
    hoje = datetime.now()

    for dia_offset in range(dias):
        data = hoje - timedelta(days=dia_offset)

        # 80% de chance de registrar água no dia
        if random.random() < 0.80:
            tipo_nome, unidade = random.choice(TIPOS_AGUA)
            litros = round(random.uniform(cfg["agua_litros_min"], cfg["agua_litros_max"]), 1)
            consumos.append(Consumo(
                id_usuario=id_usuario,
                tipo_consumo="agua",
                valor=litros,
                unidade_medida=unidade,
                nome_custom=tipo_nome,
                data_personalizada=data,
                data_registro=data,
                is_simulado=False,
            ))

        # 70% de chance de registrar energia no dia
        if random.random() < 0.70:
            tipo_nome, unidade = random.choice(TIPOS_ENERGIA)
            kwh = round(random.uniform(cfg["energia_kwh_min"], cfg["energia_kwh_max"]), 3)
            consumos.append(Consumo(
                id_usuario=id_usuario,
                tipo_consumo="energia",
                valor=kwh,
                unidade_medida=unidade,
                nome_custom=tipo_nome,
                data_personalizada=data,
                data_registro=data,
                is_simulado=False,
            ))

        # 20% de chance de registrar outros (conta, gás) no dia
        if random.random() < 0.20:
            tipo_nome, unidade = random.choice(TIPOS_OUTROS)
            valor_rs = round(random.uniform(cfg["gasto_rs_min"], cfg["gasto_rs_max"]), 2)
            consumos.append(Consumo(
                id_usuario=id_usuario,
                tipo_consumo="outros",
                valor=0,
                unidade_medida=unidade,
                nome_custom=tipo_nome,
                valor_monetario=valor_rs,
                data_personalizada=data,
                data_registro=data,
                is_simulado=False,
            ))

    return consumos


def main():
    reset = "--reset" in sys.argv

    # Garante que as tabelas existem (fallback se migrations não foram rodadas)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        total_usuarios = 0
        total_consumos = 0

        for dados in USUARIOS_DEMO:
            usuario_existente = db.query(Usuario).filter_by(email=dados["email"]).first()

            if usuario_existente:
                if reset:
                    print(f"[RESET] Removendo usuário existente: {dados['email']}")
                    db.query(Consumo).filter_by(id_usuario=usuario_existente.id).delete()
                    db.delete(usuario_existente)
                    db.commit()
                else:
                    print(f"[SKIP] Usuário já existe: {dados['email']} (use --reset para recriar)")
                    continue

            # Cria o usuário com senha hasheada via bcrypt direto (security.py)
            novo_usuario = Usuario(
                nome=dados["nome"],
                email=dados["email"],
                senha=hash_senha(dados["senha"]),
            )
            db.add(novo_usuario)
            db.flush()  # gera o id sem fechar a transação

            consumos = gerar_consumos(novo_usuario.id, dados["perfil"], dias=30)
            db.bulk_save_objects(consumos)

            total_usuarios += 1
            total_consumos += len(consumos)
            print(f"[OK] {dados['nome']} ({dados['email']}) — {len(consumos)} registros criados")

        db.commit()
        print(f"\n[SEED OK] Seed concluído: {total_usuarios} usuário(s), {total_consumos} consumo(s) criado(s)")
        print("\nCredenciais para demo:")
        for u in USUARIOS_DEMO:
            print(f"  • {u['nome']:8s}  {u['email']:30s}  senha: {u['senha']}")

    except Exception as e:
        db.rollback()
        print(f"\n[ERRO] Erro ao executar seed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
