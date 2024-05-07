export const formatMoney = (value: number) => {
  const formattedValue = (value / 100).toFixed(2); // Garante dois dígitos após a vírgula
  return `R$ ${formattedValue.replace('.', ',')}`;
}