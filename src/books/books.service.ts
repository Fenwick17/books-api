import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Book } from '@prisma/client';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  private async checkBookExists(id: number): Promise<Book> {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  getBooks(): Promise<Book[]> {
    return this.prisma.book.findMany();
  }

  async getBookById(id: number): Promise<Book> {
    return this.checkBookExists(id);
  }

  createBook(dto: CreateBookDto): Promise<Book> {
    return this.prisma.book.create({
      data: dto,
    });
  }

  async updateBook(id: number, dto: UpdateBookDto): Promise<Book> {
    await this.checkBookExists(id);
    return this.prisma.book.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async deleteBook(id: number): Promise<Book> {
    await this.checkBookExists(id);
    return this.prisma.book.delete({
      where: {
        id,
      },
    });
  }
}
