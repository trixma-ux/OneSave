// Configuration de sécurité centralisée
const DEV_ENVS = ['development', 'test'];

export const isDevLikeEnv = (): boolean =>
  DEV_ENVS.includes(process.env.NODE_ENV || 'development');

// Fallback réservé au développement/tests locaux (jamais utilisé en production)
const DEV_ONLY_JWT_SECRET = 'onesave-dev-only-jwt-secret-do-not-use-in-prod';

/**
 * Retourne le secret JWT. En dehors de development/test, JWT_SECRET est obligatoire.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.trim() !== '') return secret;
  if (isDevLikeEnv()) return DEV_ONLY_JWT_SECRET;
  throw new Error('JWT_SECRET doit être défini (NODE_ENV=' + (process.env.NODE_ENV || '') + ').');
}

/**
 * Vérifie la configuration au démarrage : échoue immédiatement si un secret
 * obligatoire manque en production.
 */
export function assertProductionConfig(): void {
  getJwtSecret();
}
