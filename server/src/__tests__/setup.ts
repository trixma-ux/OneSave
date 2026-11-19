import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test database (SQLite paths are relative to prisma/schema.prisma,
// so 'file:./test.db' => server/prisma/test.db)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./test.db';
}
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

// Increase jest timeout for database operations
jest.setTimeout(30000);
