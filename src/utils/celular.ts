/**
 * Utilitários para validação e formatação de celular brasileiro
 */

/**
 * Remove todos os caracteres não numéricos do celular
 */
export function cleanCelular(celular: string): string {
  return celular.replace(/\D/g, '');
}

/**
 * Formata o celular no padrão (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export function formatCelular(celular: string): string {
  const cleaned = cleanCelular(celular);
  
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  
  // Para celular com 11 dígitos (9 na frente)
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
}

/**
 * Valida se o celular é válido (10 ou 11 dígitos)
 */
export function validateCelular(celular: string): boolean {
  const cleaned = cleanCelular(celular);
  
  // Verifica se tem 10 ou 11 dígitos
  if (cleaned.length !== 10 && cleaned.length !== 11) return false;
  
  // Verifica se não são todos os dígitos iguais
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  // Verifica se o DDD é válido (11 a 99)
  const ddd = parseInt(cleaned.slice(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  
  // Para celular com 11 dígitos, o terceiro dígito deve ser 9
  if (cleaned.length === 11 && cleaned[2] !== '9') return false;
  
  // Para celular com 10 dígitos, o terceiro dígito não pode ser 0 ou 1
  if (cleaned.length === 10 && (cleaned[2] === '0' || cleaned[2] === '1')) return false;
  
  return true;
}

/**
 * Máscara para input de celular
 */
export function celularMask(value: string): string {
  return formatCelular(value);
}

/**
 * Verifica se o celular está no formato correto (com ou sem formatação)
 */
export function isCelularFormat(celular: string): boolean {
  const cleaned = cleanCelular(celular);
  return (cleaned.length === 10 || cleaned.length === 11) && /^\d+$/.test(cleaned);
}