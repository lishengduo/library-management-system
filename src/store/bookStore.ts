import { create } from 'zustand';
import type { Book, Category } from '@/types';
import { mockBooks, mockCategories } from '@/data/mockData';

interface BookStore {
  books: Book[];
  categories: Category[];
  searchQuery: string;
  selectedCategory: string;
  sortBy: 'title' | 'author' | 'borrowCount';
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: string) => void;
  setSortBy: (sort: 'title' | 'author' | 'borrowCount') => void;
  getFilteredBooks: () => Book[];
  getBookById: (id: string) => Book | undefined;
  borrowBook: (bookId: string) => boolean;
  returnBook: (bookId: string) => void;
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
}

export const useBookStore = create<BookStore>((set, get) => ({
  books: mockBooks,
  categories: mockCategories,
  searchQuery: '',
  selectedCategory: '',
  sortBy: 'title',

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),

  setSortBy: (sort) => set({ sortBy: sort }),

  getFilteredBooks: () => {
    const { books, searchQuery, selectedCategory, sortBy } = get();
    
    let filtered = [...books];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.isbn.includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((book) => book.categoryId === selectedCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'borrowCount':
          return (b.stock - b.available) - (a.stock - a.available);
        default:
          return 0;
      }
    });

    return filtered;
  },

  getBookById: (id) => {
    return get().books.find((book) => book.id === id);
  },

  borrowBook: (bookId) => {
    const { books } = get();
    const book = books.find((b) => b.id === bookId);
    if (book && book.available > 0) {
      set({
        books: books.map((b) =>
          b.id === bookId ? { ...b, available: b.available - 1 } : b
        ),
      });
      return true;
    }
    return false;
  },

  returnBook: (bookId) => {
    const { books } = get();
    set({
      books: books.map((b) =>
        b.id === bookId ? { ...b, available: Math.min(b.available + 1, b.stock) } : b
      ),
    });
  },

  addBook: (bookData) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({ books: [...state.books, newBook] }));
  },

  updateBook: (id, updates) => {
    set((state) => ({
      books: state.books.map((b) =>
        b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
      ),
    }));
  },

  deleteBook: (id) => {
    set((state) => ({ books: state.books.filter((b) => b.id !== id) }));
  },
}));
