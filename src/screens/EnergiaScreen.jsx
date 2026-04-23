import React, { useState } from "react";
import { C } from "../constants/colors";
import StatBar from "../components/StatBar";

// Calcula consumo (kWh) e custo (R$) de um aparelho elétrico.
// Fórmula: kWh = (potência_em_watts × tempo_em_minutos) / 60 / 1000
// Custo: R$ = kWh × tarifa (0,87 = média nacional de R$/kWh)

const EnergiaScreen = () => {
  const [aparelho, setAparelho] = useState("Chuveiro");
  const [potencia, setPotencia] = useState(5500); // em Watts
  const [tempo, setTempo] = useState(15); // em minutos

  const kWh = ((potencia * tempo) / 60 / 1000).toFixed(2);
  const custo = (parseFloat(kWh) * 0.87).toFixed(2); // tarifa simulada

  return (
    <div style={{ padding: "0 18px" }}>
      <p style={{ color: C.textSub, fontSize: 13, margin: "0 0 16px" }}>
        Selecione um aparelho para calcular o consumo
      </p>
    </div>
  );
};

export default EnergiaScreen;
