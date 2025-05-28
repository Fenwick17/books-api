import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  const prismaMock = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockUser = { id: 1, email: 'test@example.com', password: 'password' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    prismaMock.user.create.mockResolvedValue(mockUser);
    const result = await service.createUser(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should find a user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    const result = await service.findByEmail(mockUser.email);
    expect(result).toEqual(mockUser);
  });
});
