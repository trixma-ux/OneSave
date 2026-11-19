import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Base de test PostgreSQL (service Postgres en CI, instance locale sinon)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/onesave_test?schema=public';
}
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

// Increase jest timeout for database operations
jest.setTimeout(30000);
