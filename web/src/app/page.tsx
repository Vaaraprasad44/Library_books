'use client'

import { useState, useMemo } from "react";
import { useGetBooksQuery, useSearchBooksQuery } from "@/store/api";
import { LibrarySidebar } from "@/components/library-sidebar";
import { LibraryHeader, SortOption, SortDirection } from "@/components/library-header";
import { BookGrid } from "@/components/book-grid";
import { FilterOptions } from "@/components/filter-dropdown";

export default function LibraryPage() {
    const { data: allBooks } = useGetBooksQuery();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>('title');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [filters, setFilters] = useState<FilterOptions>({});

    const { data: searchResults } = useSearchBooksQuery(
        { title: searchQuery || '' },
        { skip: !searchQuery }
    );

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleSort = (sort: SortOption, direction: SortDirection) => {
        setSortBy(sort);
        setSortDirection(direction);
    };

    const handleFilter = (newFilters: FilterOptions) => {
        setFilters(newFilters);
    };

    // Calculate filtered count for header
    const displayedBooks = searchQuery ? searchResults : allBooks;
    const filteredCount = useMemo(() => {
        if (!displayedBooks) return 0;
        
        let filtered = [...displayedBooks];
        
        if (filters.genre) {
            filtered = filtered.filter(book => book.genre === filters.genre);
        }
        
        if (filters.rating) {
            filtered = filtered.filter(book => book.rating && book.rating >= filters.rating!);
        }
        
        if (filters.publicationYear) {
            filtered = filtered.filter(book => {
                if (!book.publication_year) return false;
                const { start, end } = filters.publicationYear!;
                if (start && book.publication_year < start) return false;
                if (end && book.publication_year > end) return false;
                return true;
            });
        }
        
        return filtered.length;
    }, [displayedBooks, filters]);

    // Get available genres for filter dropdown
    const availableGenres = useMemo(() => {
        if (!allBooks) return [];
        const genres = new Set<string>();
        allBooks.forEach(book => {
            if (book.genre) genres.add(book.genre);
        });
        return Array.from(genres).sort();
    }, [allBooks]);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <LibrarySidebar />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-auto">
                    <div className="p-6">
                        <LibraryHeader 
                            onSearch={handleSearch}
                            onSort={handleSort}
                            onFilter={handleFilter}
                            totalBooks={filteredCount}
                            availableGenres={availableGenres}
                        />
                        <div className="mt-6">
                            <BookGrid 
                                searchQuery={searchQuery}
                                sortBy={sortBy}
                                sortDirection={sortDirection}
                                filters={filters}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}