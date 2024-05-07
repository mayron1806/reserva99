export function isValidISO8601Date(value: any) {
  if (value instanceof Date) {
    return value.toISOString() === value.toISOString(); 
  }
  return false;
}
