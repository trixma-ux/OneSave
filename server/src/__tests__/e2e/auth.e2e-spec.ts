import request from 'supertest';
import app from '../../index';
import { prisma } from '../../index';

describe('Authentication E2E Tests', () => {
  // Clean up database before tests
  beforeAll(async () => {
    // Reset database
    try {
      await prisma.notification.deleteMany();
      await prisma.moduleSpecifique.deleteMany();
      await prisma.evenement.deleteMany();
      await prisma.projet.deleteMany();
      await prisma.utilisateur.deleteMany();
    } catch (error) {
      console.log('Database cleanup warning:', error);
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'Test User',
          email: 'test@example.com',
          motDePasse: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('utilisateur');
      expect(response.body.utilisateur.email).toBe('test@example.com');
      expect(response.body.utilisateur.nom).toBe('Test User');
    });

    it('should fail with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          // Missing nom and motDePasse
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should fail with duplicate email', async () => {
      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'User One',
          email: 'duplicate@example.com',
          motDePasse: 'password123',
        });

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'User Two',
          email: 'duplicate@example.com',
          motDePasse: 'password456',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('déjà utilisé');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      // Create a test user for login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'Login Test User',
          email: 'login@example.com',
          motDePasse: 'correctPassword123',
        });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          motDePasse: 'correctPassword123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('utilisateur');
      expect(response.body.utilisateur.email).toBe('login@example.com');
    });

    it('should fail with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          motDePasse: 'wrongPassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('incorrect');
    });

    it('should fail with non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          motDePasse: 'anyPassword',
        });

      expect(response.status).toBe(401);
    });

    it('should fail with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          // Missing password
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/auth/me', () => {
    let token: string;

    beforeAll(async () => {
      // Register and login to get token
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'Me Test User',
          email: 'metest@example.com',
          motDePasse: 'password123',
        });

      token = response.body.token;
    });

    it('should get current user info with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('metest@example.com');
      expect(response.body.nom).toBe('Me Test User');
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
    });
  });
});
