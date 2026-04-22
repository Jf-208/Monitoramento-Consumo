// =============================================================
// COMPONENTE: BottomNav
// -------------------------------------------------------------
// Barra de navegação fixa no rodapé do app.
// Exibe 3 destinos: Início, Relatórios, Perfil.
// Item ativo = cor dourada + linha decorativa abaixo.
//
// Props:
//   active    → id da tela atual (ex: "home")
//   onNav(id) → função para trocar de tela
// =============================================================

import { C } from "../constants/colors";
import { NAV_ITEMS } from "../constants/data";

export default function BottomNav({ active, onNav }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        background: `${C.surface}F4`,
        backdropFilter: "blur(16px)",
        borderTop: `1px solid ${C.border}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id; // true se esta é a tela atual

        return (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px 22px",
              borderRadius: 14,
            }}
          >
            {/* Ícone: opaco e dourado se ativo, apagado se inativo */}
            <span
              style={{
                fontSize: 20,
                opacity: isActive ? 1 : 0.38,
                color: isActive ? C.gold : C.text,
              }}
            >
              {item.icon}
            </span>

            {/* Label */}
            <span
              style={{
                fontSize: 10,
                color: isActive ? C.gold : C.textMuted,
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {item.label}
            </span>

            {/* Linha dourada — só aparece no item ativo */}
            {isActive && (
              <div
                style={{
                  width: 16,
                  height: 3,
                  borderRadius: 2,
                  background: C.gold,
                  boxShadow: `0 0 8px ${C.gold}`,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
