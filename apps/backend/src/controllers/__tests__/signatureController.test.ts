import request from 'supertest';
import express from 'express';
import { SignatureController } from '../signatureController';

// Create a test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  const controller = new SignatureController();
  app.post('/verify-signature', controller.verifySignature);
  
  return app;
};

describe('SignatureController', () => {
  let app: express.Express;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('POST /verify-signature', () => {
    it('should handle signature verification', async () => {
      const requestBody = {
        message: 'Hello World',
        signature: 'test-signature'
      };

      const response = await request(app)
        .post('/verify-signature')
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.originalMessage).toBe(requestBody.message);
      expect(typeof response.body.data.isValid).toBe('boolean');
    });

    it('should handle invalid signature', async () => {
      const requestBody = {
        message: 'Hello World',
        signature: '0xinvalidsignature'
      };

      const response = await request(app)
        .post('/verify-signature')
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isValid).toBe(false);
      expect(response.body.data.originalMessage).toBe(requestBody.message);
    });

    it('should return 400 for missing message', async () => {
      const requestBody = {
        signature: 'test-signature'
      };

      const response = await request(app)
        .post('/verify-signature')
        .send(requestBody)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Missing required fields: message and signature');
    });

    it('should return 400 for missing signature', async () => {
      const requestBody = {
        message: 'Hello World'
      };

      const response = await request(app)
        .post('/verify-signature')
        .send(requestBody)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Missing required fields: message and signature');
    });
  });
});