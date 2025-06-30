import request from 'supertest';
import * as server from '../backend/server';

describe('API Endpoints Testing - Part 1', () => {
  // Test /api/send-whatsapp endpoint
  describe('POST /api/send-whatsapp', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await request(server.app).post('/api/send-whatsapp').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });

    it('should return 200 on successful send', async () => {
      const res = await request(server.app).post('/api/send-whatsapp').send({
        userId: 'test-user-id',
        message: 'Test message',
        phone: '+1234567890'
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('WhatsApp message sent successfully');
    });
  });
});
