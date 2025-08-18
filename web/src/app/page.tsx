'use client'

import { useState, useMemo } from "react";
import { useGetBooksQuery } from "@/store/api";
import { LibrarySidebar } from "@/components/library-sidebar";
import { LibraryHeader, SortOption, SortDirection } from "@/components/library-header";
import { BookGrid } from "@/components/book-grid";
import { FilterOptions } from "@/components/filter-dropdown";

export default function LibraryPage() {
    const { data: books } = useGetBooksQuery();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>('title');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [filters, setFilters] = useState<FilterOptions>({});

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

    // Get available genres for filter dropdown
    const availableGenres = useMemo(() => {
        if (!books) return [];
        const genres = new Set<string>();
        books.forEach(book => {
            if (book.genre) genres.add(book.genre);
        });
        return Array.from(genres).sort();
    }, [books]);

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
                            totalBooks={books?.length || 0}
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