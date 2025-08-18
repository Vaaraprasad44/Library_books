'use client'

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useGetBookByIdQuery } from "@/store/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Check, Plus } from "lucide-react";
import { useToRead } from "@/contexts/to-read-context";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = parseInt(params.id as string);
  
  const { data: book, isLoading, isError, error } = useGetBookByIdQuery({ id: bookId });
  const [hasRead, setHasRead] = useState(false);
  const { addToReadBook, removeFromReadBook, isInToReadList } = useToRead();
  
  const bookInToRead = book ? isInToReadList(book.id) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading book details...</div>
      </div>
    );
  }

  if (isError || !book) {
    console.error('Book detail error:', error);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 dark:text-red-400 mb-4">Error loading book details.</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Book ID: {bookId} {isNaN(bookId) && '(Invalid ID)'}
          </div>
          <Button onClick={() => router.push('/')}>Back to Library</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
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
        </div>

        {/* Book Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <div className="aspect-[3/4] bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md flex items-center justify-center">
                <div className="text-white text-center p-6">
                  <div className="text-lg font-medium line-clamp-3 mb-2">{book.title}</div>
                  <div className="text-sm opacity-80">{book.author}</div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-4 space-y-3">
                <Button
                  onClick={() => setHasRead(!hasRead)}
                  className={`w-full flex items-center justify-center space-x-2 ${
                    hasRead 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {hasRead ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Mark as Unread</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4" />
                      <span>Mark as Read</span>
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    if (book) {
                      if (bookInToRead) {
                        removeFromReadBook(book.id);
                      } else {
                        addToReadBook(book);
                      }
                    }
                  }}
                  className={`w-full flex items-center justify-center space-x-2 ${
                    bookInToRead 
                      ? 'border-orange-500 text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-400' 
                      : ''
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>
                    {bookInToRead ? 'Remove from To-Read' : 'Add to To-Read List'}
                  </span>
                </Button>
              </div>
            </div>

            {/* Book Information */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{book.author}</p>
                
                {book.rating && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <= (book.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-600 dark:text-gray-300">({book.rating}/5)</span>
                  </div>
                )}
              </div>

              {/* Book Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {book.isbn && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">ISBN:</span>
                    <p className="text-gray-600 dark:text-gray-400">{book.isbn}</p>
                  </div>
                )}
                
                {book.publication_year && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Publication Year:</span>
                    <p className="text-gray-600 dark:text-gray-400">{book.publication_year}</p>
                  </div>
                )}
                
                {book.publisher && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Publisher:</span>
                    <p className="text-gray-600 dark:text-gray-400">{book.publisher}</p>
                  </div>
                )}
                
                {book.genre && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Genre:</span>
                    <p className="text-gray-600 dark:text-gray-400">{book.genre}</p>
                  </div>
                )}
                
                {book.pages && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Pages:</span>
                    <p className="text-gray-600 dark:text-gray-400">{book.pages}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {book.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{book.description}</p>
                </div>
              )}

              {/* Reading Status Display */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                {hasRead && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                    <Check className="h-3 w-3 mr-1" />
                    Read
                  </span>
                )}
                
                {bookInToRead && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">
                    <Plus className="h-3 w-3 mr-1" />
                    To Read
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}