import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from '@prisma/client';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Roles } from '../auth/roles/role.decorator';
import { Role } from '../auth/roles/role.enum';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  @Roles(Role.User)
  getBooks(): Promise<Book[]> {
    return this.booksService.getBooks();
  }

  @Get(':id')
  @Roles(Role.User)
  getBookById(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return this.booksService.getBookById(id);
  }

  @Post()
  @Roles(Role.Admin)
  async createBook(@Body() body: CreateBookDto): Promise<Book> {
    return this.booksService.createBook(body);
  }

  @Put(':id')
  @Roles(Role.Admin)
  updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.updateBook(id, body);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  deleteBook(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return this.booksService.deleteBook(id);
  }
}
