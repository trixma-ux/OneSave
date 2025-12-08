import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test database
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./prisma/test.db';
}

// Increase jest timeout for database operations
jest.setTimeout(30000);
