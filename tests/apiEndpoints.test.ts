import request from 'supertest';
import app from '../backend/server';

describe('API Endpoints Testing', () => {
  // Test /api/send-whatsapp endpoint
  describe('POST /api/send-whatsapp', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/api/send-whatsapp').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });

    it('should return 200 on successful send', async () => {
      const res = await request(app).post('/api/send-whatsapp').send({
        userId: 'test-user-id',
        message: 'Test message',
        phone: '+1234567890'
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('WhatsApp message sent successfully');
    });
  });

  // Test /api/schedule-whatsapp-notification endpoint
  describe('POST /api/schedule-whatsapp-notification', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/api/schedule-whatsapp-notification').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });

    it('should return 201 on successful scheduling', async () => {
      const res = await request(app).post('/api/schedule-whatsapp-notification').send({
        userId: 'test-user-id',
        message: 'Scheduled message',
        scheduledTime: '2024-06-01T10:00:00Z'
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe('Notification scheduled');
      expect(res.body.notificationId).toBeDefined();
    });
  });

  // Test /api/clear-scheduled-notifications endpoint
  describe('POST /api/clear-scheduled-notifications', () => {
    it('should return 400 if userId is missing', async () => {
      const res = await request(app).post('/api/clear-scheduled-notifications').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });

    it('should return 200 on successful clearing', async () => {
      const res = await request(app).post('/api/clear-scheduled-notifications').send({
        userId: 'test-user-id'
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Old scheduled notifications cleared');
    });
  });
});
