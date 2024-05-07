export const unmaskMoney = (value: string) => {
  return Number(value.replace('R$ ', '').replaceAll(',', '').replaceAll('.', ''))
}
export const unmaskTime = (value: string) => {
  const hour = Number(value.slice(0, 2));
  const minute = Number(value.slice(3, 5));
  const seconds = (hour * 3600) + (minute * 60);
  return seconds;
}