import { create } from 'zustand';
import type { BorrowRecord, Reservation, Favorite } from '@/types';
import { mockBorrowRecords, mockReservations, mockFavorites } from '@/data/mockData';
import { useBookStore } from './bookStore';

interface BorrowStore {
  borrowRecords: BorrowRecord[];
  reservations: Reservation[];
  favorites: Favorite[];
  getUserBorrowRecords: (userId: string) => BorrowRecord[];
  getUserReservations: (userId: string) => Reservation[];
  getUserFavorites: (userId: string) => Favorite[];
  createBorrowRecord: (userId: string, bookId: string) => boolean;
  renewBorrowRecord: (recordId: string) => boolean;
  returnBook: (recordId: string) => void;
  createReservation: (userId: string, bookId: string) => boolean;
  cancelReservation: (reservationId: string) => void;
  addFavorite: (userId: string, bookId: string) => boolean;
  removeFavorite: (userId: string, bookId: string) => void;
  isFavorite: (userId: string, bookId: string) => boolean;
}

export const useBorrowStore = create<BorrowStore>((set, get) => ({
  borrowRecords: mockBorrowRecords,
  reservations: mockReservations,
  favorites: mockFavorites,

  getUserBorrowRecords: (userId) => {
    const { borrowRecords } = get();
    const bookStore = useBookStore.getState();
    
    return borrowRecords
      .filter((record) => record.userId === userId)
      .map((record) => ({
        ...record,
        book: bookStore.getBookById(record.bookId),
      }));
  },

  getUserReservations: (userId) => {
    const { reservations } = get();
    const bookStore = useBookStore.getState();
    
    return reservations
      .filter((reservation) => reservation.userId === userId)
      .map((reservation) => ({
        ...reservation,
        book: bookStore.getBookById(reservation.bookId),
      }));
  },

  getUserFavorites: (userId) => {
    const { favorites } = get();
    const bookStore = useBookStore.getState();
    
    return favorites
      .filter((favorite) => favorite.userId === userId)
      .map((favorite) => ({
        ...favorite,
        book: bookStore.getBookById(favorite.bookId),
      }));
  },

  createBorrowRecord: (userId, bookId) => {
    const { borrowRecords } = get();
    // 防止同一用户重复借阅同一本书（未归还的）
    const existingBorrow = borrowRecords.find(
      (r) => r.userId === userId && r.bookId === bookId && r.status === 'borrowed'
    );
    if (existingBorrow) {
      return false;
    }

    const bookStore = useBookStore.getState();
    const success = bookStore.borrowBook(bookId);
    
    if (success) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 45);
      
      const newRecord: BorrowRecord = {
        id: Date.now().toString(),
        userId,
        bookId,
        borrowDate: new Date(),
        dueDate,
        status: 'borrowed',
        renewCount: 0,
        createdAt: new Date(),
      };
      
      set((state) => ({ borrowRecords: [...state.borrowRecords, newRecord] }));
      return true;
    }
    return false;
  },

  renewBorrowRecord: (recordId) => {
    const { borrowRecords } = get();
    const record = borrowRecords.find((r) => r.id === recordId);
    
    // 只有借阅中的记录才能续借
    if (record && record.status === 'borrowed' && record.renewCount < 2) {
      const newDueDate = new Date(record.dueDate);
      newDueDate.setDate(newDueDate.getDate() + 30);
      
      set((state) => ({
        borrowRecords: state.borrowRecords.map((r) =>
          r.id === recordId
            ? { ...r, dueDate: newDueDate, renewCount: r.renewCount + 1 }
            : r
        ),
      }));
      return true;
    }
    return false;
  },

  returnBook: (recordId) => {
    const { borrowRecords } = get();
    const record = borrowRecords.find((r) => r.id === recordId);
    
    // 只有借阅中的记录才能归还
    if (record && record.status === 'borrowed') {
      const bookStore = useBookStore.getState();
      bookStore.returnBook(record.bookId);
      
      set((state) => ({
        borrowRecords: state.borrowRecords.map((r) =>
          r.id === recordId
            ? { ...r, returnDate: new Date(), status: 'returned' as const }
            : r
        ),
      }));
    }
  },

  createReservation: (userId, bookId) => {
    const { reservations } = get();
    const existingReservation = reservations.find(
      (r) => r.userId === userId && r.bookId === bookId && r.status === 'pending'
    );
    
    if (existingReservation) {
      return false;
    }
    
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 15);
    
    const newReservation: Reservation = {
      id: Date.now().toString(),
      userId,
      bookId,
      reserveDate: new Date(),
      expireDate,
      status: 'pending',
      createdAt: new Date(),
    };
    
    set((state) => ({ reservations: [...state.reservations, newReservation] }));
    return true;
  },

  cancelReservation: (reservationId) => {
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === reservationId
          ? { ...r, status: 'canceled' as const }
          : r
      ),
    }));
  },

  addFavorite: (userId, bookId) => {
    const { favorites } = get();
    const existingFavorite = favorites.find(
      (f) => f.userId === userId && f.bookId === bookId
    );
    
    if (existingFavorite) {
      return false;
    }
    
    const newFavorite: Favorite = {
      id: Date.now().toString(),
      userId,
      bookId,
      createdAt: new Date(),
    };
    
    set((state) => ({ favorites: [...state.favorites, newFavorite] }));
    return true;
  },

  removeFavorite: (userId, bookId) => {
    set((state) => ({
      favorites: state.favorites.filter(
        (f) => !(f.userId === userId && f.bookId === bookId)
      ),
    }));
  },

  isFavorite: (userId, bookId) => {
    const { favorites } = get();
    return favorites.some((f) => f.userId === userId && f.bookId === bookId);
  },
}));
