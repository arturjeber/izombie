// lib/sanitize.ts
import DOMPurify from "isomorphic-dompurify";

// Função para sanitizar um objeto recursivamente
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: Record<string, any> = {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "string") {
      sanitized[key] = DOMPurify.sanitize(value);
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value); // recursivo
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}
