import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BookSerivce', () => {
  let prisma: PrismaService;
  let service: BooksService;

  const prismaMock = {
    book: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of books', async () => {
    const books = [
      { id: 1, name: 'Book 1' },
      { id: 2, name: 'Book 2' },
    ];
    prismaMock.book.findMany.mockResolvedValue(books);
    const result = await service.getBooks();
    expect(result).toEqual([
      { id: 1, name: 'Book 1' },
      { id: 2, name: 'Book 2' },
    ]);
  });

  it('should return a single book by ID', async () => {
    const book = { id: 1, name: 'Book 1' };
    prismaMock.book.findUnique.mockResolvedValue(book);
    const result = await service.getBookById(1);
    expect(result).toEqual(book);
  });

  it('should create a book', async () => {
    const bookDto: CreateBookDto = { name: 'Book 3' };
    const createdBook = { id: 3, name: 'Book 3' };

    prismaMock.book.create.mockResolvedValue(createdBook);

    const result = await service.createBook(bookDto);
    expect(result).toEqual({ id: 3, name: 'Book 3' });
  });

  it('should update a book', async () => {
    const bookDto: UpdateBookDto = { name: 'A third book' };
    const existingBook = { id: 3, name: 'Old name' };
    const updatedBook = { id: 3, name: 'A third book' };
    prismaMock.book.findUnique.mockResolvedValue(existingBook);
    prismaMock.book.update.mockResolvedValue(updatedBook);
    const result = await service.updateBook(3, bookDto);
    expect(result).toEqual({ id: 3, name: 'A third book' });
  });

  it('should delete a book', async () => {
    const book = { id: 3, name: 'Book 3' };
    prismaMock.book.findUnique.mockResolvedValue(book);
    prismaMock.book.delete.mockResolvedValue(book);
    const result = await service.deleteBook(3);
    expect(result).toEqual({ id: 3, name: 'Book 3' });
  });
});
