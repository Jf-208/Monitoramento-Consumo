import React from "react";
import { C } from "../constants/colors";

const DicasScreen = () => {
  const dicas = [
    {
      icon: "🚿",
      title: "Banhos curtos",
      desc: "Banhos de até 5 min economizam até 60% da água",
      cor: C.blue,
    },
    {
      icon: "🔌",
      title: "Tirar da tomada",
      desc: "Desligar aparelhos em stand-by reduz até 12% no consumo",
      cor: C.gold,
    },
    {
      icon: "💡",
      title: "Lâmpadas LED",
      desc: "Consomem até 80% menos energia que as incandescentes",
      cor: C.teal,
    },
    {
      icon: "🌡️",
      title: "Ar-condicionado",
      desc: "Manter a 23°C reduz em 10% o consumo elétrico",
      cor: C.violet,
    },
    {
      icon: "🫙",
      title: "Reúso de água",
      desc: "Água do enxágue pode ser reaproveitada para limpeza",
      cor: C.blue,
    },
  ];
  return (
    <div
      style={{
        padding: "0 18px",
        display: "flex",
        flexDirection: "column",
        gap: 11,
      }}
    >
      {dicas.map((d, i) => (
        <div
          key={i}
          style={{
            background: `linear-gradient(135deg, ${d.cor}14, ${d.cor}06)`,
            border: `1px solid ${d.cor}35`,
            borderRadius: 18,
            padding: 16,
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(5px)";
            e.currentTarget.style.boxShadow = `0 6px 20px ${d.cor}22`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "";
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 13,
              flexShrink: 0,
              background: `${d.cor}20`,
              border: `1px solid ${d.cor}35`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            {d.icon}
          </div>
          <div>
            <p
              style={{
                color: d.cor,
                fontWeight: 700,
                margin: "0 0 4px",
                fontSize: 14,
              }}
            >
              {d.title}
            </p>
            <p
              style={{
                color: C.textSub,
                fontSize: 13,
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              {d.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DicasScreen;
