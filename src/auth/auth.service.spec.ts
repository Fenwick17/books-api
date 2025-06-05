import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Role } from './roles/role.enum';

describe('AuthService', () => {
  let service: AuthService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const usersServiceMock = {
    createUser: jest.fn(),
    validateUser: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '15m' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const hashedPassword = await bcrypt.hash('password', 10);
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      roles: [Role.Admin],
    };
    const mockedUser = {
      id: 1,
      email: 'test@example.com',
      password: hashedPassword,
      roles: [Role.Admin],
    };

    jest.spyOn(prismaMock.user, 'findUnique').mockResolvedValue(null);
    usersServiceMock.createUser.mockResolvedValue(mockedUser);

    const result = await service.register(createUserDto);
    expect(result).toEqual(mockedUser);
  });

  it('should error if a user already exists', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      roles: [Role.User],
    };

    const existingUser = {
      id: 1,
      email: 'existing@example.com',
      password: 'hashed',
      roles: [Role.User],
    };

    prismaMock.user.findUnique.mockResolvedValue(existingUser);
    usersServiceMock.createUser.mockResolvedValue(existingUser);

    await expect(service.register(createUserDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should validate a user exists', async () => {
    const hashedPassword = await bcrypt.hash('password', 10);
    const mockedUser = {
      id: 1,
      email: 'test@example.com',
      password: hashedPassword,
    };

    usersServiceMock.findByEmail.mockResolvedValue(mockedUser);

    const result = await service.validateUser('test@example.com', 'password');
    expect(result).toEqual(mockedUser);
  });

  it('should validate no user exists', async () => {
    usersServiceMock.findByEmail.mockResolvedValue(null);
    const result = await service.validateUser('test@example.com', 'password');
    expect(result).toBeNull();
  });
});
