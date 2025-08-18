'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetBooksQuery } from "@/store/api";
import { LibrarySidebar } from "@/components/library-sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookmarkPlus, X } from "lucide-react";
import { Book } from "@/store/api/generated/books";
import { useToRead } from "@/contexts/to-read-context";

interface ToReadBookCardProps {
  book: Book;
  onRemove: (bookId: number) => void;
}

function ToReadBookCard({ book, onRemove }: ToReadBookCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/book/${book.id}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex space-x-4">
        {/* Book Cover */}
        <div 
          className="w-16 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded cursor-pointer flex-shrink-0 flex items-center justify-center"
          onClick={handleClick}
        >
          <div className="text-white text-xs text-center p-1">
            <div className="line-clamp-2 font-medium">{book.title}</div>
          </div>
        </div>
        
        {/* Book Info */}
        <div className="flex-1 min-w-0">
          <h3 
            className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
            onClick={handleClick}
          >
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{book.author}</p>
          {book.genre && (
            <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded mt-2">
              {book.genre}
            </span>
          )}
          {book.rating && (
            <div className="flex items-center mt-2 space-x-1">
              <span className="text-xs text-yellow-500 dark:text-yellow-400">★</span>
              <span className="text-xs text-gray-600 dark:text-gray-300">{book.rating}/5</span>
            </div>
          )}
        </div>
        
        {/* Remove Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(book.id);
          }}
          className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function ToReadPage() {
  const router = useRouter();
  const { data: allBooks } = useGetBooksQuery();
  const { toReadBooks, addToReadBook, removeFromReadBook, isInToReadList } = useToRead();

  const handleRemoveBook = (bookId: number) => {
    removeFromReadBook(bookId);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <LibrarySidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4 flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Library</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <BookmarkPlus className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">To-Read List</h1>
                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded text-sm font-medium">
                  {toReadBooks.length} books
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Keep track of books you want to read. Add books from the library or book detail pages.
              </p>
            </div>

            {/* To-Read Books List */}
            <div className="space-y-4">
              {toReadBooks.length > 0 ? (
                toReadBooks.map((book) => (
                  <ToReadBookCard
                    key={book.id}
                    book={book}
                    onRemove={handleRemoveBook}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <BookmarkPlus className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No books in your to-read list</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Start building your reading list by adding books from the library.
                  </p>
                  <Button onClick={() => router.push('/')}>
                    Browse Library
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Add Section */}
            {allBooks && allBooks.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Add from Library</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allBooks.slice(0, 6).map((book) => (
                    <div key={book.id} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex-shrink-0 flex items-center justify-center">
                        <div className="text-white text-xs text-center p-1">
                          <div className="line-clamp-2 font-medium">{book.title}</div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{book.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{book.author}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (!isInToReadList(book.id)) {
                            addToReadBook(book);
                          }
                        }}
                        disabled={isInToReadList(book.id)}
                      >
                        <BookmarkPlus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}