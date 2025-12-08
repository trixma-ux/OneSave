import request from 'supertest';
import { prisma } from '../index';
import app from '../index';

const testEmail = `e2e+${Date.now()}@example.com`;

describe('Auth E2E', () => {
  beforeAll(async () => {
    // Ensure DB is ready (migrations already applied)
  });

  afterAll(async () => {
    // Clean up created user
    try {
      await prisma.utilisateur.deleteMany({ where: { email: { contains: 'e2e+' } } });
    } catch (e) {
      // ignore
    }
    await prisma.$disconnect();
  });

  test('Register -> Login -> Get /auth/me', async () => {
    const password = 'Password123!';

    // Register
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ nom: 'E2E User', email: testEmail, motDePasse: password })
      .set('Accept', 'application/json');

    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toHaveProperty('token');

    const token = registerRes.body.token;

    // Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, motDePasse: password })
      .set('Accept', 'application/json');

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('token');

    // Me
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(meRes.status).toBe(200);
    expect(meRes.body).toHaveProperty('email', testEmail);
  }, 20000);
});
