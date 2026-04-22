// =============================================================
// COMPONENTE: Logo
// -------------------------------------------------------------
// Exibe a identidade visual da marca "wavunder".
// Reutilizado no topo de todas as telas (via AppNavigator).
// Não recebe props — é sempre igual.
// =============================================================

import React from "react";
import { C } from "../constants/colors";

export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      {/* Globo circular com gradiente radial e ícone de raio */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          // radial-gradient: degradê circular, começa claro no centro (38% 38%)
          background: `radial-gradient(circle at 38% 38%, ${C.blue}, ${C.blueDim})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 17,
          // box-shadow duplo: brilho externo + realce interno
          boxShadow: `0 0 14px ${C.blue}55, inset 0 1px 0 ${C.blue}88`,
        }}
      >
        ⚡
      </div>

      {/* Nome da marca: "wav" em azul + "under" em dourado */}
      <span
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: 0.5,
        }}
      >
        <span style={{ color: C.blue }}>wav</span>
        <span style={{ color: C.gold }}>under</span>
      </span>
    </div>
  );
}
