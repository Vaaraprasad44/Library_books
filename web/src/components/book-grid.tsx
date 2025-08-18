'use client'

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useGetBooksQuery, useSearchBooksQuery } from "@/store/api";
import { Book } from "@/store/api/generated/books";
import { SortOption, SortDirection, ViewMode } from "./library-header";
import { FilterOptions } from "./filter-dropdown";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookCardProps {
  book: Book;
  viewMode: ViewMode;
}

function BookCard({ book, viewMode }: BookCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/book/${book.id}`);
  };

  if (viewMode === 'list') {
    return (
      <div className="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow" onClick={handleClick}>
        <div className="flex space-x-4">
          {/* Book Cover */}
          <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex-shrink-0 flex items-center justify-center">
            <div className="text-white text-xs text-center p-1">
              <div className="line-clamp-2 font-medium">{book.title}</div>
            </div>
          </div>
          
          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">{book.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{book.author}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              {book.genre && (
                <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                  {book.genre}
                </span>
              )}
              {book.publication_year && <span>{book.publication_year}</span>}
              {book.pages && <span>{book.pages} pages</span>}
              {book.rating && (
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500 dark:text-yellow-400">★</span>
                  <span>{book.rating}</span>
                </div>
              )}
            </div>
            
            {book.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{book.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group cursor-pointer" onClick={handleClick}>
      <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
        {/* Placeholder for book cover - you can add actual cover images later */}
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="text-white text-center p-4">
            <div className="text-sm font-medium line-clamp-3 mb-2">{book.title}</div>
            <div className="text-xs opacity-80">{book.author}</div>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">{book.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{book.author}</p>
        {book.rating && (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-yellow-500 dark:text-yellow-400">★</span>
            <span className="text-xs text-gray-600 dark:text-gray-300">{book.rating}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface BookGridProps {
  searchQuery?: string;
  sortBy?: SortOption;
  sortDirection?: SortDirection;
  filters?: FilterOptions;
  viewMode?: ViewMode;
}

const BOOKS_PER_PAGE = 24;

export function BookGrid({ searchQuery, sortBy = 'title', sortDirection = 'asc', filters = {}, viewMode = 'grid' }: BookGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: allBooks, isLoading: isLoadingAll, isError: isErrorAll } = useGetBooksQuery();
  const { data: searchResults, isLoading: isLoadingSearch, isError: isErrorSearch } = useSearchBooksQuery(
    { title: searchQuery || '' },
    { skip: !searchQuery }
  );

  // Determine which data to use
  const rawBooks = searchQuery ? searchResults : allBooks;
  const isLoading = searchQuery ? isLoadingSearch : isLoadingAll;
  const isError = searchQuery ? isErrorSearch : isErrorAll;

  // Apply filters and sorting
  const { allFilteredBooks, paginatedBooks, totalPages } = useMemo(() => {
    if (!rawBooks) return { allFilteredBooks: [], paginatedBooks: [], totalPages: 0 };

    let filteredBooks = [...rawBooks];

    // Apply filters
    if (filters.genre) {
      filteredBooks = filteredBooks.filter(book => book.genre === filters.genre);
    }

    if (filters.rating) {
      filteredBooks = filteredBooks.filter(book => book.rating && book.rating >= filters.rating!);
    }

    if (filters.publicationYear) {
      filteredBooks = filteredBooks.filter(book => {
        if (!book.publication_year) return false;
        const { start, end } = filters.publicationYear!;
        if (start && book.publication_year < start) return false;
        if (end && book.publication_year > end) return false;
        return true;
      });
    }

    // Apply sorting
    filteredBooks.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case 'year':
          comparison = (a.publication_year || 0) - (b.publication_year || 0);
          break;
        case 'pages':
          comparison = (a.pages || 0) - (b.pages || 0);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    const endIndex = startIndex + BOOKS_PER_PAGE;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    return { allFilteredBooks: filteredBooks, paginatedBooks, totalPages };
  }, [rawBooks, filters, sortBy, sortDirection, currentPage]);

  // Reset to page 1 when filters or search change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy, sortDirection]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading books...</div>
      </div>
    );
  }

  if (isError || !paginatedBooks) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 dark:text-red-400">Error loading books.</div>
      </div>
    );
  }

  if (allFilteredBooks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">
          {searchQuery ? 'No books found matching your search.' : 'No books available.'}
        </div>
      </div>
    );
  }

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - halfVisible);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Books Display */}
      <div className={viewMode === 'list' ? "space-y-4" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"}>
        {paginatedBooks.map((book) => (
          <BookCard key={book.id} book={book} viewMode={viewMode} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {((currentPage - 1) * BOOKS_PER_PAGE) + 1} to {Math.min(currentPage * BOOKS_PER_PAGE, allFilteredBooks.length)} of {allFilteredBooks.length} books
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            <div className="flex items-center space-x-1">
              {generatePageNumbers().map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageClick(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}