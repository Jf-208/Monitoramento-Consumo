import React, { useState } from "react";
import { C } from "../constants/colors";
import Chip from "../components/Chip";
import StatBar from "../components/StatBar";

// Calcula o consumo de água com base no tempo de banho.
// Fórmula: 1 minuto de banho ≈ 7 litros (estimativa média de chuveiro)

const AguaScreen = () => {
  const [banho, setBanho] = useState(13); // minutos de banho (padrão: 13 min)

  const litros = Math.round(banho * 7); // converte minutos → litros

  // Lógica condicional para mostrar alerta ou elogio
  const economia =
    banho > 10
      ? `Reduzir ${banho - 10} min economiza ${(banho - 10) * 7} L` // aviso
      : "Ótimo tempo de banho! 🌟"; // elogio

  return (
    <div style={{ padding: "0 18px" }}>
      <p style={{ color: C.textSub, fontSize: 13, margin: "0 0 16px" }}>
        Tempo de banho: {banho} minutos
      </p>
      <p style={{ color: C.blue, fontSize: 20, fontWeight: 700 }}>
        {litros} L de água
      </p>
    </div>
  );
};

export default AguaScreen;
