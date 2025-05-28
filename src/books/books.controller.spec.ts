import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('BooksController', () => {
  let booksService: BooksService;
  let booksController: BooksController;

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
      controllers: [BooksController],
      providers: [
        BooksService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    booksController = module.get<BooksController>(BooksController);
    booksService = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(booksController).toBeDefined();
  });

  describe('getBooks', () => {
    it('should return an array of books', async () => {
      const result = [
        { id: 1, name: 'Book 1' },
        { id: 2, name: 'Book 2' },
      ];

      prismaMock.book.findMany.mockResolvedValue(result);

      expect(await booksController.getBooks()).toBe(result);
    });
  });

  describe('getBooksById', () => {
    it('should return a book', async () => {
      const result = { id: 2, name: 'Book 2', userId: null };

      prismaMock.book.findUnique.mockResolvedValue(result);

      expect(await booksController.getBookById(2)).toBe(result);
    });

    it('should throw NotFoundException if book does not exist', async () => {
      prismaMock.book.findUnique.mockResolvedValue(null);

      await expect(booksController.getBookById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createBook', () => {
    it('should create a book', async () => {
      const result = { id: 3, name: 'Book 3' };
      const bookDto = { name: 'Book 3' };

      prismaMock.book.create.mockResolvedValue(result);

      expect(await booksController.createBook(bookDto)).toBe(result);
    });
  });

  describe('updateBook', () => {
    it('should update a book', async () => {
      const result = { id: 3, name: 'A third book' };
      const bookDto = { name: 'A third book' };

      prismaMock.book.findUnique.mockResolvedValue(bookDto);
      prismaMock.book.update.mockResolvedValue(result);

      expect(await booksController.updateBook(3, bookDto)).toBe(result);
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', async () => {
      const result = { id: 3, name: 'Book 3' };

      prismaMock.book.delete.mockResolvedValue(result);

      expect(await booksController.deleteBook(3)).toBe(result);
    });
  });
});
