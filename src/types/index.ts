export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  studentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publishDate: Date;
  description: string;
  coverUrl: string;
  stock: number;
  available: number;
  categoryId: string;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  book?: Book;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'borrowed' | 'returned' | 'overdue';
  renewCount: number;
  createdAt: Date;
}

export interface Reservation {
  id: string;
  userId: string;
  bookId: string;
  book?: Book;
  reserveDate: Date;
  expireDate: Date;
  status: 'pending' | 'completed' | 'canceled';
  createdAt: Date;
}

export interface Favorite {
  id: string;
  userId: string;
  bookId: string;
  book?: Book;
  createdAt: Date;
}
