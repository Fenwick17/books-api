import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma.service';
import { IS_RFC_3339 } from 'class-validator';

describe('BooksController', () => {
  let booksService: BooksService;
  let booksController: BooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [BooksService, PrismaService],
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
      const spy = jest
        .spyOn(booksService, 'getBooks')
        .mockResolvedValue(result);

      expect(await booksController.getBooks()).toBe(result);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getBooksById', () => {
    it('should return a book', async () => {
      const result = { id: 2, name: 'Book 2' };
      const spy = jest
        .spyOn(booksService, 'getBookById')
        .mockResolvedValue(result);

      expect(await booksController.getBookById(2)).toBe(result);
      expect(spy).toHaveBeenCalledWith(2);
    });
  });

  describe('createBook', () => {
    it('should create a book', async () => {
      const result = { id: 3, name: 'Book 3' };
      const bookDto = { name: 'Book 3' };
      const spy = jest
        .spyOn(booksService, 'createBook')
        .mockResolvedValue(result);

      expect(await booksController.createBook(bookDto)).toBe(result);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('updateBook', () => {
    it('should update a book', async () => {
      const result = { id: 3, name: 'A third book' };
      const bookDto = { name: 'A third book' };
      const spy = jest
        .spyOn(booksService, 'updateBook')
        .mockResolvedValue(result);

      expect(await booksController.updateBook(3, bookDto)).toBe(result);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', async () => {
      const result = { id: 3, name: 'Book 3' };
      const spy = jest
        .spyOn(booksService, 'deleteBook')
        .mockResolvedValue(result);

      expect(await booksController.deleteBook(3)).toBe(result);
      expect(spy).toHaveBeenCalled();
    });
  });
});
