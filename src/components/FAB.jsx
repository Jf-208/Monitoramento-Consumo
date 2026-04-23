// =============================================================
// COMPONENTE: FAB (Floating Action Button)
// -------------------------------------------------------------
// Botão flutuante "+" no canto superior direito.
// Ao clicar, expande um menu com atalhos para as telas.
// O "+" gira 45° e vira "×" quando aberto.
//
// Props:
//   onSelect(id) → função chamada ao escolher um item
//                  recebe o id da tela destino (ex: "agua")
// =============================================================

import { useState } from "react";
import { C } from "../constants/colors";
import { FAB_ITEMS } from "../constants/data";

export default function FAB({ onSelect }) {
  // Estado local: controla se o menu está aberto ou fechado
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", zIndex: 200 }}>
      {/* Menu expandido — só renderiza quando open === true */}
      {open &&
        FAB_ITEMS.map((item, i) => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              top: `${42 + i * 56}px`, // empilha: 42px, 98px, 154px, 210px
              right: 0,
              display: "flex",
              alignItems: "center",
              gap: 9,
              animation: `fabIn 0.24s ${i * 0.055}s both`, // delay escalonado
            }}
          >
            {/* Label do item */}
            <div
              style={{
                background: `${C.surface}F5`,
                border: `1px solid ${C.border}`,
                borderRadius: 11,
                padding: "5px 13px",
                color: item.color,
                fontSize: 13,
                fontWeight: 700,
                backdropFilter: "blur(10px)",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </div>

            {/* Botão circular do item */}
            <button
              onClick={() => {
                onSelect(item.id); // navega para a tela
                setOpen(false); // fecha o menu
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: `2px solid ${item.color}55`,
                background: `${item.color}22`,
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </button>
          </div>
        ))}

      {/* Overlay invisível — clicando fora fecha o menu */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: -1 }}
        />
      )}

      {/* Botão principal "+" */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "none",
          // muda cor: dourado fechado → vermelho aberto
          background: open
            ? `linear-gradient(135deg, ${C.danger}, #C0003A)`
            : `linear-gradient(135deg, ${C.gold}, #B07800)`,
          color: "#fff",
          fontSize: 22,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // rotate(45deg) transforma "+" em "×" visualmente
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "all 0.3s cubic-bezier(0.68,-0.6,0.32,1.6)",
        }}
      >
        +
      </button>
    </div>
  );
}
