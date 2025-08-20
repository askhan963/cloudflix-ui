// src/config/env.ts

export function getEnv() {
  const base = import.meta.env.VITE_API_BASE_URL;

  if (!base) {
    throw new Error("❌ VITE_API_BASE_URL is not defined in your .env file");
  }

  return {
    VITE_API_BASE_URL: base as string,
  };
}
