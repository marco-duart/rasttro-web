function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(
      `Variável de ambiente "${key}" não definida. Copie ".env.example" para ".env.local" e preencha "${key}".`,
    );
  }
  return value;
}

export const env = {
  VITE_API_URL: requireEnv('VITE_API_URL'),
};
