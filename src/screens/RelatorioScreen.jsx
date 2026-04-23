import React from "react";
import { C } from "../constants/colors";
// Exibe dois gráficos:
//   1. Barras duplas por dia da semana (água azul + energia dourada)
//   2. Gráfico de rosca (donut chart) feito com SVG puro

// COMO O GRÁFICO DE BARRAS FUNCIONA:
// A altura de cada barra = (valor / máximo) * altura_máxima_em_px
// Isso garante que a maior barra sempre toque o topo.

// COMO O GRÁFICO DE ROSCA FUNCIONA (SVG):
// Usa <circle> com strokeDasharray para desenhar arcos.
// strokeDasharray="45 55" = 45% colorido, 55% transparente
// strokeDashoffset desloca o início do arco para não sobrepor o anterior

const RelatoriosScreen = () => {
  const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const agua = [60, 75, 55, 80, 65, 40, 45];
  const energia = [0.9, 1.1, 0.8, 1.3, 1.0, 0.7, 0.5];
  const maxA = Math.max(...agua),
    maxE = Math.max(...energia);
  return (
    <div style={{ padding: "0 18px" }}>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: 20,
          marginBottom: 14,
        }}
      >
        <p
          style={{
            color: C.textSub,
            fontSize: 11,
            margin: "0 0 16px",
            textTransform: "uppercase",
            letterSpacing: 1.2,
          }}
        >
          Consumo semanal
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 5,
            height: 90,
          }}
        >
          {dias.map((d, i) => (
            <div
              key={d}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  height: 72,
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    width: "55%",
                    height: `${(agua[i] / maxA) * 58}px`,
                    background: `linear-gradient(180deg, ${C.blue}, ${C.blue}88)`,
                    borderRadius: "3px 3px 0 0",
                    boxShadow: `0 0 6px ${C.blue}55`,
                  }}
                />
                <div
                  style={{
                    width: "55%",
                    height: `${(energia[i] / maxE) * 58}px`,
                    background: `linear-gradient(0deg, ${C.gold}, ${C.gold}88)`,
                    borderRadius: "0 0 3px 3px",
                    boxShadow: `0 0 6px ${C.gold}55`,
                  }}
                />
              </div>
              <span style={{ color: C.textMuted, fontSize: 9 }}>{d}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          {[
            { label: "Água (L)", color: C.blue },
            { label: "Energia (kWh)", color: C.gold },
          ].map(({ label, color }) => (
            <div
              key={label}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: color,
                  boxShadow: `0 0 4px ${color}`,
                }}
              />
              <span style={{ color: C.textSub, fontSize: 11 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: 20,
        }}
      >
        <p
          style={{
            color: C.textSub,
            fontSize: 11,
            margin: "0 0 16px",
            textTransform: "uppercase",
            letterSpacing: 1.2,
          }}
        >
          Distribuição do consumo
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 88, height: 88, flexShrink: 0 }}>
            <svg
              viewBox="0 0 36 36"
              style={{ transform: "rotate(-90deg)", width: 88, height: 88 }}
            >
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={`${C.blue}33`}
                strokeWidth="4.5"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={C.blue}
                strokeWidth="4.5"
                strokeDasharray="45 55"
                strokeLinecap="round"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={C.gold}
                strokeWidth="4.5"
                strokeDasharray="35 65"
                strokeDashoffset="-45"
                strokeLinecap="round"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={C.violet}
                strokeWidth="4.5"
                strokeDasharray="20 80"
                strokeDashoffset="-80"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            {[
              { label: "Água", pct: "45%", color: C.blue },
              { label: "Energia", pct: "35%", color: C.gold },
              { label: "Outros", pct: "20%", color: C.violet },
            ].map(({ label, pct, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 9,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: color,
                      boxShadow: `0 0 5px ${color}`,
                    }}
                  />
                  <span style={{ color: C.textSub, fontSize: 13 }}>
                    {label}
                  </span>
                </div>
                <span style={{ color, fontWeight: 700, fontSize: 14 }}>
                  {pct}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RelatoriosScreen;
