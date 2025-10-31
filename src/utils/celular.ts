export function cleanCelular(celular: string): string {
  const cleaned = celular.replace(/\D/g, "");

  if (
    cleaned.startsWith("55") &&
    (cleaned.length === 12 || cleaned.length === 13)
  ) {
    return cleaned.slice(2);
  }

  return cleaned;
}

export function formatCelularToE164(celular: string): string {
  const cleaned = cleanCelular(celular);

  if (cleaned.length === 10 || cleaned.length === 11) {
    return `+55${cleaned}`;
  }

  return cleaned;
}
export function formatCelular(celular: string): string {
  const cleaned = cleanCelular(celular);

  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 6)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length <= 10)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
      6
    )}`;

  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
    7,
    11
  )}`;
}

export function validateCelular(celular: string): boolean {
  const cleaned = cleanCelular(celular);

  if (cleaned.length !== 10 && cleaned.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;

  const ddd = parseInt(cleaned.slice(0, 2));
  if (ddd < 11 || ddd > 99) return false;

  if (cleaned.length === 11 && cleaned[2] !== "9") return false;
  if (cleaned.length === 10 && (cleaned[2] === "0" || cleaned[2] === "1"))
    return false;

  return true;
}

export function celularMask(value: string): string {
  return formatCelular(value);
}

export function isCelularFormat(celular: string): boolean {
  const cleaned = cleanCelular(celular);
  return (
    (cleaned.length === 10 || cleaned.length === 11) && /^\d+$/.test(cleaned)
  );
}
