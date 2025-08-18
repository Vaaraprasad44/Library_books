'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book } from '@/store/api/generated/books';

interface ToReadContextType {
  toReadBooks: Book[];
  addToReadBook: (book: Book) => void;
  removeFromReadBook: (bookId: number) => void;
  isInToReadList: (bookId: number) => boolean;
}

const ToReadContext = createContext<ToReadContextType | undefined>(undefined);

export function ToReadProvider({ children }: { children: ReactNode }) {
  const [toReadBooks, setToReadBooks] = useState<Book[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mk-library-to-read');
    if (saved) {
      try {
        setToReadBooks(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading to-read books:', error);
      }
    }
  }, []);

  // Save to localStorage whenever toReadBooks changes
  useEffect(() => {
    localStorage.setItem('mk-library-to-read', JSON.stringify(toReadBooks));
  }, [toReadBooks]);

  const addToReadBook = (book: Book) => {
    setToReadBooks(prev => {
      if (prev.find(b => b.id === book.id)) {
        return prev; // Already exists
      }
      return [...prev, book];
    });
  };

  const removeFromReadBook = (bookId: number) => {
    setToReadBooks(prev => prev.filter(book => book.id !== bookId));
  };

  const isInToReadList = (bookId: number) => {
    return toReadBooks.some(book => book.id === bookId);
  };

  return (
    <ToReadContext.Provider value={{
      toReadBooks,
      addToReadBook,
      removeFromReadBook,
      isInToReadList
    }}>
      {children}
    </ToReadContext.Provider>
  );
}

export function useToRead() {
  const context = useContext(ToReadContext);
  if (context === undefined) {
    throw new Error('useToRead must be used within a ToReadProvider');
  }
  return context;
}