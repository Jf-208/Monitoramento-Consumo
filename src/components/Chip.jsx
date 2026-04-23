// =============================================================
// COMPONENTE: Chip
// -------------------------------------------------------------
// Badge compacto que exibe um dado resumido.
// Usado em: HomeScreen, PerfilScreen
//
// Props:
//   label  → texto descritivo (ex: "Água poupada")
//   value  → valor destacado  (ex: "69 L")
//   color  → cor do valor e da borda (vem de C.blue, C.gold...)
//   icon   → emoji opcional à esquerda
// =============================================================

import { C } from "../constants/colors";

export default function Chip({ label, value, color, icon }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        // color + "16" = 16 em hex = ~9% de opacidade (fundo suave)
        background: `${color}16`,
        // color + "38" = 38 em hex = ~22% de opacidade (borda sutil)
        border: `1px solid ${color}38`,
        borderRadius: 10,
        padding: "7px 13px",
      }}
    >
      {/* Ícone — só renderiza se for passado */}
      {icon && <span style={{ fontSize: 14 }}>{icon}</span>}

      {/* Label discreta */}
      <span style={{ color: C.textSub, fontSize: 11 }}>{label}</span>

      {/* Valor em destaque na cor definida */}
      <span style={{ color, fontWeight: 700, fontSize: 13 }}>{value}</span>
    </div>
  );
}
