/**
 * Utilitários para validação de email
 */

/**
 * Valida se o email tem formato válido
 */
export function validateEmail(email: string): boolean {
  // Regex mais robusta para validação de email
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) return false;
  
  // Verifica se não tem pontos consecutivos
  if (email.includes('..')) return false;
  
  // Verifica se não começa ou termina com ponto
  const localPart = email.split('@')[0];
  if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
  
  // Verifica comprimento
  if (email.length > 254) return false;
  if (localPart.length > 64) return false;
  
  return true;
}

/**
 * Normaliza o email (converte para lowercase e remove espaços)
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Verifica se o email tem um domínio válido
 */
export function hasValidDomain(email: string): boolean {
  const domain = email.split('@')[1];
  if (!domain) return false;
  
  // Verifica se o domínio tem pelo menos um ponto
  if (!domain.includes('.')) return false;
  
  // Verifica se não começa ou termina com hífen
  if (domain.startsWith('-') || domain.endsWith('-')) return false;
  
  // Verifica se a extensão tem pelo menos 2 caracteres
  const extension = domain.split('.').pop();
  if (!extension || extension.length < 2) return false;
  
  return true;
}

/**
 * Validação completa de email
 */
export function validateEmailComplete(email: string): boolean {
  const normalized = normalizeEmail(email);
  return validateEmail(normalized) && hasValidDomain(normalized);
}