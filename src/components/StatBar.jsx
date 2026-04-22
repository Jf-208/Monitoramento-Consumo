// =============================================================
// COMPONENTE: StatBar
// -------------------------------------------------------------
// Barra de progresso horizontal com animação suave.
// Usada em: HomeScreen (consumo semanal de água e energia)
//
// Props:
//   label → nome da métrica (ex: "Consumo de Água")
//   value → valor atual     (ex: 420)
//   max   → valor máximo    (ex: 700)
//   color → cor da barra    (ex: C.blue)
//   unit  → unidade         (ex: "L" ou "kWh")
// =============================================================

import { C } from "../constants/colors.js";

export default function StatBar({ label, value, max, color, unit }) {
  // Calcula percentual; Math.min garante máximo de 100%
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Linha superior: label à esquerda, valor à direita */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 7,
        }}
      >
        <span style={{ color: C.textSub, fontSize: 12 }}>{label}</span>
        <span style={{ color, fontWeight: 700, fontSize: 13 }}>
          {value} {unit}
        </span>
      </div>

      {/* Trilha de fundo */}
      <div
        style={{
          height: 5,
          background: `${color}1A`, // fundo muito transparente
          borderRadius: 8,
          overflow: "hidden", // evita barra sair fora da trilha
        }}
      >
        {/* Barra preenchida — largura muda conforme pct */}
        <div
          style={{
            height: "100%",
            width: `${pct}%`, // AQUI acontece o cálculo visual
            borderRadius: 8,
            // gradiente da esquerda (70% opaco) para direita (100% sólido)
            background: `linear-gradient(90deg, ${color}70, ${color})`,
            boxShadow: `0 0 10px ${color}88`,
            // Animação: quando pct muda, a largura anima suavemente
            transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
    </div>
  );
}
