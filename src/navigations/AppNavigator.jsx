// =============================================================
// NAVEGAÇÃO: AppNavigator
// -------------------------------------------------------------
// Controla qual tela está sendo exibida no momento.
// Funciona como um "roteador manual" com objeto de mapa.
//
// Fluxo:
//   1. Estado "screen" guarda o id da tela atual (ex: "home")
//   2. screenMap busca o componente correto pelo id
//   3. O componente Screen é renderizado dinamicamente
// =============================================================

import { useState } from "react";
import HomeScreen from "../screens/HomeScreen";
import AguaScreen from "../screens/AguaScreen";
import EnergiaScreen from "../screens/EnergiaScreen";
import DicasScreen from "../screens/DicasScreen";
import RelatorioScreen from "../screens/RelatorioScreen";
import PerfilScreen from "../screens/PerfilScreen";
import BottomNav from "../components/BottomNav";
import FAB from "../components/FAB";
import Logo from "../components/Logo";
import { C } from "../constants/colors";

// Mapa: id → componente da tela correspondente
const screenMap = {
  home: HomeScreen,
  agua: AguaScreen,
  energia: EnergiaScreen,
  dicas: DicasScreen,
  relatorios: RelatorioScreen,
  perfil: PerfilScreen,
};

// Títulos do header interno (null = sem header)
const screenTitles = {
  home: null,
  agua: "💧 Consumo de Água",
  energia: "⚡ Consumo de Energia",
  dicas: "🌿 Dicas Sustentáveis",
  relatorios: "📊 Relatórios",
  perfil: "👤 Perfil",
};

export default function AppNavigator() {
  // Estado central: qual tela está ativa
  const [screen, setScreen] = useState("home");

  // Busca o componente pelo id; fallback para Home se não encontrar
  const Screen = screenMap[screen] || HomeScreen;

  return (
    <div
      style={{
        width: 375,
        height: 780,
        background: C.bg,
        borderRadius: 42,
        overflow: "hidden",
        position: "relative",
        boxShadow: `0 40px 100px #00000099, 0 0 0 1px ${C.border}88`,
      }}
    >
      {/* Barra de status (topo) */}
      <div
        style={{
          height: 46,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 22px",
          background: `linear-gradient(180deg, ${C.surface}CC, transparent)`,
        }}
      >
        <span style={{ color: C.textSub, fontSize: 12, fontWeight: 600 }}>
          9:41
        </span>
        <Logo />
        {/* FAB chama setScreen para navegar entre telas */}
        <FAB onSelect={setScreen} />
      </div>

      {/* Linha dourada decorativa */}
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.gold}55, transparent)`,
        }}
      />

      {/* Header interno (só nas sub-telas) */}
      {screenTitles[screen] && (
        <div
          style={{
            padding: "13px 18px 9px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            onClick={() => setScreen("home")}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              background: C.card,
              color: C.textSub,
              fontSize: 17,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ←
          </button>
          <span style={{ color: C.text, fontWeight: 700, fontSize: 17 }}>
            {screenTitles[screen]}
          </span>
        </div>
      )}

      {/* Saudação (só na Home) */}
      {screen === "home" && (
        <div style={{ padding: "13px 18px 8px" }}>
          <p style={{ color: C.textSub, fontSize: 13, margin: "0 0 1px" }}>
            Olá, Cristiano 👋
          </p>
          <p
            style={{ color: C.text, fontSize: 23, fontWeight: 800, margin: 0 }}
          >
            Seu painel
          </p>
        </div>
      )}

      {/* Área de conteúdo com scroll */}
      <div
        style={{
          overflowY: "auto",
          height: "calc(100% - 47px - 70px - 54px)",
          paddingBottom: 8,
        }}
      >
        {/* Renderiza a tela atual passando setScreen como onNav */}
        <Screen onNav={setScreen} />
      </div>

      {/* Navegação inferior */}
      <BottomNav active={screen} onNav={setScreen} />
    </div>
  );
}
