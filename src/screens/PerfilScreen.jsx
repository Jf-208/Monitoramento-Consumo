import React from "react";
import { C } from "../constants/colors";
import Chip from "../components/Chip";

const PerfilScreen = () => (
  <div style={{ padding: "0 18px" }}>
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          margin: "0 auto 14px",
          background: `linear-gradient(135deg, #1A4494, ${C.blueSoft})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 38,
          boxShadow: `0 0 28px ${C.blue}44, 0 0 0 3px ${C.blue}22`,
        }}
      >
        👤
      </div>
      <p
        style={{
          color: C.text,
          fontWeight: 700,
          fontSize: 19,
          margin: "0 0 3px",
          fontFamily: "'Sora', sans-serif",
        }}
      >
        Cristiano Silva
      </p>
      <p style={{ color: C.textSub, fontSize: 13, margin: 0 }}>
        cristiano@email.com
      </p>
    </div>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        marginBottom: 14,
      }}
    >
      <Chip icon="💧" label="Água poupada" value="69 L" color={C.blue} />
      <Chip icon="⚡" label="Energia poupada" value="4.2 kWh" color={C.gold} />
    </div>
    <div
      style={{
        background: `${C.teal}12`,
        border: `1px solid ${C.teal}38`,
        borderRadius: 18,
        padding: 18,
        display: "flex",
        gap: 14,
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      <span style={{ fontSize: 30 }}>🌱</span>
      <div>
        <p
          style={{
            color: C.teal,
            fontWeight: 700,
            margin: "0 0 3px",
            fontSize: 14,
          }}
        >
          Nível: Iniciante Sustentável
        </p>
        <p style={{ color: C.textSub, fontSize: 12, margin: 0 }}>
          Continue assim para alcançar Pro!
        </p>
      </div>
    </div>
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        overflow: "hidden",
        marginBottom: 14,
      }}
    >
      {["Notificações", "Privacidade", "Ajuda"].map((item, i) => (
        <div
          key={item}
          style={{
            padding: "14px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = C.cardHover)}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <span style={{ color: C.text, fontSize: 14 }}>{item}</span>
          <span style={{ color: C.textMuted, fontSize: 16 }}>›</span>
        </div>
      ))}
    </div>
    <button
      style={{
        width: "100%",
        padding: 14,
        borderRadius: 14,
        border: `1px solid ${C.danger}40`,
        background: `${C.danger}14`,
        color: C.danger,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = `${C.danger}28`)}
      onMouseLeave={(e) => (e.currentTarget.style.background = `${C.danger}14`)}
    >
      Sair da conta
    </button>
  </div>
);

export default PerfilScreen;
