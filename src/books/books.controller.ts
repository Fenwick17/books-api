import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from '@prisma/client';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  getBooks(): Promise<Book[]> {
    return this.booksService.getBooks();
  }

  @Get(':id')
  getBookById(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return this.booksService.getBookById(id);
  }

  @Post()
  async createBook(@Body() body: CreateBookDto): Promise<Book> {
    return this.booksService.createBook(body);
  }

  @Put(':id')
  updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.updateBook(id, body);
  }

  @Delete(':id')
  deleteBook(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return this.booksService.deleteBook(id);
  }
}
