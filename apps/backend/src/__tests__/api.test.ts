import request from 'supertest';
import app from '../server';

describe('API Integration Tests', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.status).toBe('OK');
      expect(response.body.data.timestamp).toBeDefined();
      expect(response.body.data.uptime).toBeDefined();
      expect(typeof response.body.data.uptime).toBe('number');
    });
  });

  describe('POST /api/verify-signature', () => {
    it('should verify signature through full API', async () => {
      const requestBody = {
        message: 'Hello World',
        signature: 'test-signature'
      };

      const response = await request(app)
        .post('/api/verify-signature')
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(typeof response.body.data.isValid).toBe('boolean');
      expect(response.body.data.originalMessage).toBe('Hello World');
    });

    it('should handle CORS preflight', async () => {
      await request(app)
        .options('/api/verify-signature')
        .expect(204);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Route /api/non-existent-route not found');
      expect(response.body.timestamp).toBeDefined();
    });

    it('should return 404 for root path', async () => {
      const response = await request(app)
        .get('/')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Route / not found');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid JSON', async () => {
      const response = await request(app)
        .post('/api/verify-signature')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(500); // Error handler returns 500 for parse errors

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
});