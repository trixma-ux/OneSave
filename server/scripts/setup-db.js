#!/usr/bin/env node

/**
 * Script pour initialiser la base de données selon l'environnement
 * - Development: PostgreSQL local (DATABASE_URL requis)
 * - Production: PostgreSQL (Neon / Render)
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

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL (PostgreSQL) est requis');
  }
  if (isDev) {
    console.log('\n💾 Applying migrations (development)...');
    execSync('npx prisma migrate dev', { stdio: 'inherit' });
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
