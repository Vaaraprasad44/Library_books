'use client'

import { useState } from "react";
import { ChevronDown, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FilterOptions {
  genre?: string;
  rating?: number;
  publicationYear?: { start?: number; end?: number };
  readStatus?: 'all' | 'read' | 'unread' | 'to-read';
}

interface FilterDropdownProps {
  onFilterChange: (filters: FilterOptions) => void;
  availableGenres: string[];
}

export function FilterDropdown({ onFilterChange, availableGenres }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 ${hasActiveFilters ? 'bg-cyan-100 text-cyan-700 border-cyan-200' : ''}`}
      >
        <Filter className="h-4 w-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="bg-cyan-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {Object.keys(filters).length}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-20 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Filter Books</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center space-x-1"
                >
                  <X className="h-3 w-3" />
                  <span>Clear all</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Genre</label>
                <select
                  value={filters.genre || ''}
                  onChange={(e) => updateFilter('genre', e.target.value || undefined)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Genres</option>
                  {availableGenres.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Rating</label>
                <select
                  value={filters.rating || ''}
                  onChange={(e) => updateFilter('rating', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>

              {/* Publication Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Publication Year</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="From"
                    value={filters.publicationYear?.start || ''}
                    onChange={(e) => updateFilter('publicationYear', {
                      ...filters.publicationYear,
                      start: e.target.value ? Number(e.target.value) : undefined
                    })}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <input
                    type="number"
                    placeholder="To"
                    value={filters.publicationYear?.end || ''}
                    onChange={(e) => updateFilter('publicationYear', {
                      ...filters.publicationYear,
                      end: e.target.value ? Number(e.target.value) : undefined
                    })}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Read Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reading Status</label>
                <select
                  value={filters.readStatus || 'all'}
                  onChange={(e) => updateFilter('readStatus', e.target.value as FilterOptions['readStatus'])}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Books</option>
                  <option value="read">Read</option>
                  <option value="unread">Unread</option>
                  <option value="to-read">To Read</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Presets */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Filters</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateFilter('rating', 4)}
                  className="px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                >
                  Highly Rated (4+)
                </button>
                <button
                  onClick={() => updateFilter('publicationYear', { start: 2020 })}
                  className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50"
                >
                  Recent (2020+)
                </button>
                <button
                  onClick={() => updateFilter('publicationYear', { end: 1950 })}
                  className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50"
                >
                  Classic (Pre-1950)
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}