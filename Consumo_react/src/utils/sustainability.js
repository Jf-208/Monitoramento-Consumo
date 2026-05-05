// sustainability.js
// Funcoes utilitarias de calculo de nivel sustentavel e economia em reais.
// Retorna objetos de nivel contendo emoji e iconName para exibicao.
// Usadas na Home, Profile e Reports.

// Tarifas medias brasileiras (ANEEL/SNIS 2023)
const TARIFA_AGUA_POR_LITRO = 6.50 / 1000;  // R$ 6,50 por m3 -> por litro
const TARIFA_ENERGIA_POR_KWH = 0.85;         // R$ 0,85 por kWh

/**
 * Calcula o nivel sustentavel baseado nos percentuais de consumo
 */
export function calcularNivel(percentualAgua = 0, percentualEnergia = 0) {
  const medio = (percentualAgua + percentualEnergia) / 2;
  if (medio <= 50) return {
    label: 'Ótimo!', cor: '#1D9E75',
    descricao: 'Você está bem abaixo da média brasileira.',
    emoji: '🌿', iconName: 'leaf',
  };
  if (medio <= 80) return {
    label: 'Bom', cor: '#378ADD',
    descricao: 'Consumo dentro da faixa aceitável.',
    emoji: '👍', iconName: 'thumbs-up',
  };
  if (medio <= 100) return {
    label: 'Atenção', cor: '#EF9F27',
    descricao: 'Próximo da meta. Reduza um pouco.',
    emoji: '⚠️', iconName: 'warning',
  };
  return {
    label: 'Crítico', cor: '#E24B4A',
    descricao: 'Consumo acima da meta. Veja as dicas!',
    emoji: '🔴', iconName: 'alert-circle',
  };
}

/**
 * Calcula o valor economizado em reais
 * Retorna valores NUMERICOS (agua, energia, total) para uso com .toFixed()
 * @param {number} aguaPoupadaL - litros poupados vs meta
 * @param {number} energiaPoupadaKwh - kWh poupados vs meta
 * @returns {{ total: number, agua: number, energia: number }}
 */
export function calcularEconomiaReais(aguaPoupadaL = 0, energiaPoupadaKwh = 0) {
  const economiaAgua    = Math.max(0, parseFloat(aguaPoupadaL) || 0) * TARIFA_AGUA_POR_LITRO;
  const economiaEnergia = Math.max(0, parseFloat(energiaPoupadaKwh) || 0) * TARIFA_ENERGIA_POR_KWH;
  const total           = economiaAgua + economiaEnergia;

  return {
    total:    parseFloat(total.toFixed(2)),
    agua:     parseFloat(economiaAgua.toFixed(2)),
    energia:  parseFloat(economiaEnergia.toFixed(2)),
  };
}
