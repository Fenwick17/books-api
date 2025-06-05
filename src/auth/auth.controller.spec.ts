import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Role } from './roles/role.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '15m' },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const hashedPassword = await bcrypt.hash('password', 10);
      const result = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        roles: [Role.User],
      };

      const userDto = {
        email: 'test@example.com',
        password: 'password',
        roles: [Role.User],
      };

      const spy = jest.spyOn(service, 'register').mockResolvedValue(result);
      const response = await controller.createUser(userDto);

      expect(response).toEqual(result);
      expect(spy).toHaveBeenCalledWith(userDto);
    });
  });

  describe('getProfile', () => {
    it('should return the current user from the request', () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
      };

      const mockReq = {
        user: mockUser,
      };

      const result = controller.getProfile(mockReq);
      expect(result).toEqual(mockUser);
    });
  });
});
