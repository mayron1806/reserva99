import moment from "moment";

export const normalizePhoneNumber = (value: string | undefined): string => {
  if (!value) return '';
  // Remove all non-digit characters
  const cleanedValue = value.replace(/\D/g, '');

  // Get DDD (first two digits) and the rest of the number
  const ddd = cleanedValue.slice(0, 2);
  const phoneNumber = cleanedValue.slice(2);
  
  // Format the phone number with the DDD
  let formattedNumber = '';
  if (ddd.length > 0) {
    formattedNumber += ddd;
    if (phoneNumber.length > 0) {
      formattedNumber += ' ' + phoneNumber.replace(/(\d{5})(\d{4})/, '$1-$2');
    }
  }
  
  return formattedNumber.slice(0, 13);
};
export const normalizeCnpjNumber = (value: String | undefined) => {
  if (!value) return ''
  
  return value.replace(/[\D]/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export const normalizeCepNumber = (value: String | undefined) => {
  if (!value) return ''
  return value.replace(/\D/g, "")
    .replace(/^(\d{5})(\d{3})+?$/, "$1-$2")
    .replace(/(-\d{3})(\d+?)/, '$1')    
}
export const normalizeSubdomain = (value: string | undefined) => {
  if (!value) return ''
  return value
    .replace(/[^a-zA-Z0-9\-]/g, '') // Remove caracteres especiais exceto hífens
    .replace(/^-+|-+$/g, '') // Remove hífens no início e no final
    .toLowerCase(); // Converte para minúsculas
}
export const normalizeMoney = (value: string | undefined) => {
  if (!value) return '';
  const cleanValue = Number(value.replace(/\D/g, "")).toString(); // Remove todos os não dígitos e 0 a esquerda
  const addDecimal = cleanValue.replace(/(\d+)(\d{2})$/, "$1,$2"); // Adiciona a parte de centavos
  const addDot = addDecimal.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  return `R$ ${addDot}`;
}
function isIsoDate(str: string) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str); 
  return d instanceof Date && !isNaN(d.getTime()) && d.toISOString()===str; // valid date 
}
export const normalizeTime = (value: string | undefined) => {
  if (!value) return '';
  if (isIsoDate(value)) {
    const date = moment(value).format('hh:mm');
    return date;
  }
  const cleanValue = value.replace(/\D/g, "").slice(0, 4); // Remove todos os não dígitos
  const formattedValue = cleanValue.replace(/(\d{2})(\d{2})/, "$1:$2"); // Adiciona os separadores
  if (formattedValue.length === 5) {
    const hour = formattedValue.slice(0, 2);
    const minute = formattedValue.slice(3, 5);
    // Validar hora e minuto
    const normalizedHour = Math.min(Math.max(parseInt(hour, 10), 0), 23);
    const normalizedMinute = Math.min(Math.max(parseInt(minute, 10), 0), 59);

    // Formatando a hora e os minutos
    const formattedHour = normalizedHour.toString().padStart(2, '0');
    const formattedMinute = normalizedMinute.toString().padStart(2, '0');

    // Criando o formato final
    return `${formattedHour}:${formattedMinute}`;
  }
  return formattedValue;
}