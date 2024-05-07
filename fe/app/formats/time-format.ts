export const durationFormat = (seconds: number) => {
  // Calcula as horas
  const hours = Math.floor(seconds / 3600);
  const stringHours = (hours < 10 ? '0' : '') + hours; // Adiciona um zero à esquerda, se necessário

  // Calcula os minutos restantes
  const minutos = Math.floor((seconds % 3600) / 60);
  const stringMinutes = (minutos < 10 ? '0' : '') + minutos; // Adiciona um zero à esquerda, se necessário

  return `${stringHours}:${stringMinutes}`;
}