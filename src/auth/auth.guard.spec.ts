import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let mockJwtService: Partial<JwtService>;
  let mockContext: any;
  let mockRequest: Partial<Request>;
  const fakePayload = { id: 1, email: 'test@example.com ' };
  const fakeToken = 'valid.jwt.token';

  beforeEach(() => {
    mockJwtService = {
      verifyAsync: jest.fn().mockResolvedValue(fakePayload),
    };

    authGuard = new AuthGuard(mockJwtService as JwtService);

    mockRequest = {
      headers: { authorization: `Bearer ${fakeToken}` },
    };

    mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({}),
        getNext: () => ({}),
      }),
    };
  });

  it('should attach payload to request["user"] after successful verification', async () => {
    const result = await authGuard.canActivate(mockContext as ExecutionContext);
    expect(result).toBe(true);
    expect(mockRequest['user']).toEqual(fakePayload);
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(fakeToken, {
      secret: expect.any(String),
    });
  });

  it('should throw UnauthorizedException after failed verification', async () => {
    (mockJwtService.verifyAsync as jest.Mock).mockRejectedValue(new Error());

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      new UnauthorizedException(),
    );
  });
});
