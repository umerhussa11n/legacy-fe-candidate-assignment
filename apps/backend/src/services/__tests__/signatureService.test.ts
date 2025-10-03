import { SignatureVerificationService } from '../signatureService';

describe('SignatureVerificationService', () => {
  let service: SignatureVerificationService;

  beforeEach(() => {
    service = new SignatureVerificationService();
  });

  describe('verifySignature', () => {
    it('should return expected structure for signature verification', async () => {
      const message = 'Hello World';
      const signature = 'test-signature';
      
      const result = await service.verifySignature({ message, signature });
      
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('originalMessage');
      expect(result.originalMessage).toBe(message);
      expect(typeof result.isValid).toBe('boolean');
    });

    it('should handle invalid signature gracefully', async () => {
      const message = 'Hello World';
      const invalidSignature = '0xinvalidsignature';
      
      const result = await service.verifySignature({ message, signature: invalidSignature });
      
      expect(result.isValid).toBe(false);
      expect(result.signer).toBe('');
      expect(result.originalMessage).toBe(message);
    });

    it('should handle empty signature', async () => {
      const message = 'Hello World';
      const emptySignature = '';
      
      const result = await service.verifySignature({ message, signature: emptySignature });
      
      expect(result.isValid).toBe(false);
      expect(result.signer).toBe('');
      expect(result.originalMessage).toBe(message);
    });

    it('should handle malformed signature', async () => {
      const message = 'Hello World';
      const malformedSignature = '0x123';
      
      const result = await service.verifySignature({ message, signature: malformedSignature });
      
      expect(result.isValid).toBe(false);
      expect(result.signer).toBe('');
      expect(result.originalMessage).toBe(message);
    });

    it('should preserve original message in response', async () => {
      const message = 'This is a test message with special chars: !@#$%^&*()';
      const invalidSignature = '0xinvalid';
      
      const result = await service.verifySignature({ message, signature: invalidSignature });
      
      expect(result.originalMessage).toBe(message);
    });
  });
});