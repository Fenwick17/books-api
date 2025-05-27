import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  private async checkUserExists(email: string): Promise<void> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists'); // 409 Conflict
    }
  }

  async register(user: CreateUserDto): Promise<any> {
    await this.checkUserExists(user.email);
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return this.usersService.createUser({ ...user, password: hashedPassword });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
