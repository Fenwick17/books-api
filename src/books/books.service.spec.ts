import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BookSerivce', () => {
  let prisma: PrismaService;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService, PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of books', async () => {
    jest.spyOn(prisma.book, 'findMany').mockResolvedValue([
      { id: 1, name: 'Book 1' },
      { id: 2, name: 'Book 2' },
    ]);

    const result = await service.getBooks();
    expect(result).toEqual([
      { id: 1, name: 'Book 1' },
      { id: 2, name: 'Book 2' },
    ]);
  });

  it('should return a single book by ID', async () => {
    jest
      .spyOn(prisma.book, 'findUnique')
      .mockResolvedValue({ id: 1, name: 'Book 1' });
    const result = await service.getBookById(1);
    expect(result).toEqual({ id: 1, name: 'Book 1' });
  });

  it('should create a book', async () => {
    const bookDto: CreateBookDto = { name: 'Book 3' };
    jest
      .spyOn(prisma.book, 'create')
      .mockResolvedValue({ id: 3, name: 'Book 3' });
    const result = await service.createBook(bookDto);
    expect(result).toEqual({ id: 3, name: 'Book 3' });
  });

  it('should update a book', async () => {
    const bookDto: UpdateBookDto = { name: 'Book 3' };
    jest
      .spyOn(prisma.book, 'findUnique')
      .mockResolvedValue({ id: 3, name: 'Book 3' });
    jest
      .spyOn(prisma.book, 'update')
      .mockResolvedValue({ id: 3, name: 'A third book' });
    const result = await service.updateBook(3, bookDto);
    expect(result).toEqual({ id: 3, name: 'A third book' });
  });

  it('should delete a book', async () => {
    jest
      .spyOn(prisma.book, 'findUnique')
      .mockResolvedValue({ id: 3, name: 'Book 3' });
    jest
      .spyOn(prisma.book, 'delete')
      .mockResolvedValue({ id: 3, name: 'Book 3' });
    const result = await service.deleteBook(3);
    expect(result).toEqual({ id: 3, name: 'Book 3' });
  });
});
