/**
 * Utilitários para validação e formatação de CNPJ
 */

/**
 * Remove todos os caracteres não numéricos do CNPJ
 */
export function cleanCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

/**
 * Formata o CNPJ no padrão XX.XXX.XXX/XXXX-XX
 */
export function formatCnpj(cnpj: string): string {
  const cleaned = cleanCnpj(cnpj);
  
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
  if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
  if (cleaned.length <= 12) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`;
  
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`;
}

/**
 * Valida se o CNPJ é válido
 */
export function validateCnpj(cnpj: string): boolean {
  const cleaned = cleanCnpj(cnpj);
  
  // Verifica se tem 14 dígitos
  if (cleaned.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleaned)) return false;
  
  // Calcula o primeiro dígito verificador
  let sum = 0;
  let weight = 5;
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  let remainder = sum % 11;
  let firstDigit = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(cleaned[12]) !== firstDigit) return false;
  
  // Calcula o segundo dígito verificador
  sum = 0;
  weight = 6;
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  remainder = sum % 11;
  let secondDigit = remainder < 2 ? 0 : 11 - remainder;
  
  return parseInt(cleaned[13]) === secondDigit;
}

/**
 * Máscara para input de CNPJ
 */
export function cnpjMask(value: string): string {
  return formatCnpj(value);
}

/**
 * Verifica se o CNPJ está no formato correto (com ou sem formatação)
 */
export function isCnpjFormat(cnpj: string): boolean {
  const cleaned = cleanCnpj(cnpj);
  return cleaned.length === 14 && /^\d{14}$/.test(cleaned);
}