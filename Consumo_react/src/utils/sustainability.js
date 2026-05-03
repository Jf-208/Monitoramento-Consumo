// sustainability.js
// Funcoes utilitarias de calculo de nivel sustentavel.
// Usadas na Home e no Profile para exibir o nivel do usuario.

export function calcularNivel(percentualAgua, percentualEnergia) {
  const medio = (percentualAgua + percentualEnergia) / 2;
  if (medio <= 50) return { label: 'Otimo!', cor: '#1D9E75', descricao: 'Voce esta bem abaixo da media brasileira.' };
  if (medio <= 80) return { label: 'Bom', cor: '#378ADD', descricao: 'Consumo dentro da faixa aceitavel.' };
  if (medio <= 100) return { label: 'Atencao', cor: '#EF9F27', descricao: 'Proximo da meta semanal. Reduza um pouco.' };
  return { label: 'Critico', cor: '#E24B4A', descricao: 'Consumo acima da meta. Veja as dicas.' };
}
