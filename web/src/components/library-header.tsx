'use client'

import { useState } from "react";
import { Search, Grid, List, ArrowUpDown, ChevronRight, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterDropdown, FilterOptions } from "./filter-dropdown";

export type SortOption = 'title' | 'author' | 'rating' | 'year' | 'pages';
export type SortDirection = 'asc' | 'desc';

interface LibraryHeaderProps {
  onSearch?: (query: string) => void;
  onSort?: (sort: SortOption, direction: SortDirection) => void;
  onFilter?: (filters: FilterOptions) => void;
  totalBooks?: number;
  availableGenres?: string[];
}

export function LibraryHeader({ 
  onSearch, 
  onSort, 
  onFilter, 
  totalBooks = 0, 
  availableGenres = [] 
}: LibraryHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSortChange = (sort: SortOption) => {
    const newDirection = sortBy === sort && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortBy(sort);
    setSortDirection(newDirection);
    onSort?.(sort, newDirection);
    setShowSortDropdown(false);
  };

  const sortOptions = [
    { value: 'title' as SortOption, label: 'Title' },
    { value: 'author' as SortOption, label: 'Author' },
    { value: 'rating' as SortOption, label: 'Rating' },
    { value: 'year' as SortOption, label: 'Publication Year' },
    { value: 'pages' as SortOption, label: 'Pages' },
  ];


  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Start Searching..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">MK's Library</span>
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>

      {/* Books Header and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Books</h1>
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-sm font-medium">
            {totalBooks}
          </span>
          <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Sort Controls */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <span>{sortOptions.find(opt => opt.value === sortBy)?.label}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </Button>
            
            {showSortDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowSortDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-20 py-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                        sortBy === option.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.value && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center space-x-2"
            onClick={() => {
              const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
              setSortDirection(newDirection);
              onSort?.(sortBy, newDirection);
            }}
          >
            <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
          </Button>

          <FilterDropdown 
            onFilterChange={onFilter || (() => {})}
            availableGenres={availableGenres}
          />
        </div>
      </div>

    </div>
  );
}