#!/usr/bin/env node

/**
 * Script pour initialiser la base de données selon l'environnement
 * - Development: SQLite (local)
 * - Production: PostgreSQL (Railway/Render/etc)
 * 
 * Usage:
 * npm run setup:db:dev    # Setup local SQLite
 * npm run setup:db:prod   # Setup production DB (requires DATABASE_URL env var)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';

console.log(`🔧 Initializing database for ${env} environment...`);

try {
  // Step 1: Generate Prisma Client
  console.log('\n📦 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Step 2: For development, create SQLite if not exists
  if (isDev) {
    console.log('\n💾 Setting up SQLite database (development)...');
    const dbPath = path.join(__dirname, '../prisma/dev.db');
    if (!fs.existsSync(dbPath)) {
      console.log('Creating dev.db...');
    }
    // Prisma migrate dev will create the DB
    execSync('npx prisma migrate dev --name initial-schema', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: 'file:./prisma/dev.db' }
    });
  } else {
    // Step 3: For production, apply migrations to remote database
    console.log('\n🚀 Applying migrations to production database...');
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required for production');
    }
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  }

  console.log('\n✅ Database setup completed successfully!');
} catch (error) {
  console.error('\n❌ Database setup failed:', error.message);
  process.exit(1);
}
