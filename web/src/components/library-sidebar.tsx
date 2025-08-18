'use client'

import { Book, BookOpen, BookmarkPlus, Settings } from "lucide-react";

export function LibrarySidebar() {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Book className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="text-xl font-semibold text-gray-900 dark:text-white">MK's Library</span>
          <BookOpen className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <a
              href="/"
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md"
            >
              <BookOpen className="h-4 w-4" />
              <span>Library</span>
            </a>
          </li>
          <li>
            <a
              href="/to-read"
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <BookmarkPlus className="h-4 w-4" />
              <span>To-Read List</span>
            </a>
          </li>
        </ul>

      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <ul className="space-y-2">
          <li>
            <a
              href="/settings"
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}