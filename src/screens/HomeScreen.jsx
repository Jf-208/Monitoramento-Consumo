import React from "react";
// Importamos a paleta de cores (C) do arquivo de constantes
import { C } from "../constants/colors";
// Importamos os componentes que você criou para compor a tela
import Chip from "../components/Chip";
import StatBar from "../components/StatBar";

const HomeScreen = ({ onNav }) => (
  <div style={{ padding: "0 18px" }}>
    <div
      style={{
        background: `linear-gradient(135deg, #1A3A70 0%, #0F2A58 60%, #0A1E44 100%)`,
        border: `1px solid ${C.border}`,
        borderRadius: 22,
        padding: "20px 20px 18px",
        marginBottom: 14,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 130,
          height: 130,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.gold}28, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: -20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.blue}22, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <p
        style={{
          color: C.textSub,
          fontSize: 11,
          margin: "0 0 3px",
          textTransform: "uppercase",
          letterSpacing: 1.2,
        }}
      >
        Nível sustentável
      </p>
      <p
        style={{
          color: C.teal,
          fontSize: 26,
          fontWeight: 800,
          margin: "0 0 14px",
          fontFamily: "'Sora', sans-serif",
        }}
      >
        Bom! 🌱
      </p>
      <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
        <Chip icon="💧" label="Água poupada" value="69 L" color={C.blue} />
        <Chip
          icon="⚡"
          label="Energia poupada"
          value="4.2 kWh"
          color={C.gold}
        />
      </div>
    </div>

    <p
      style={{
        color: C.textMuted,
        fontSize: 11,
        margin: "0 0 9px",
        textTransform: "uppercase",
        letterSpacing: 1.2,
      }}
    >
      Esta semana
    </p>
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: 18,
        marginBottom: 14,
      }}
    >
      <StatBar
        label="Consumo de Água"
        value={420}
        max={700}
        color={C.blue}
        unit="L"
      />
      <StatBar
        label="Consumo de Energia"
        value={6.3}
        max={15}
        color={C.gold}
        unit="kWh"
      />
    </div>
  </div>
);

export default HomeScreen;
