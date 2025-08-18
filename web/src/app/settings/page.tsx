'use client'

import { useRouter } from "next/navigation";
import { LibrarySidebar } from "@/components/library-sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
  ];

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
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Customize your library experience
              </p>
            </div>

            {/* Settings Content */}
            <div className="max-w-2xl space-y-8">
              {/* Appearance Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Appearance</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose how MK's Library looks to you
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Theme
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {themeOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = theme === option.value;
                        
                        return (
                          <button
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            className={`flex items-center justify-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* System Theme Info */}
                  <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        System Theme Detection
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                        The app will automatically detect your system's theme preference when you first visit. 
                        You can override this setting at any time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About</h2>
                </div>

                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Library Name:</span>
                    <span className="font-medium text-gray-900 dark:text-white">MK's Library</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <span className="font-medium text-gray-900 dark:text-white">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Library Statistics */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Library Statistics</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">5</div>
                    <div className="text-gray-600 dark:text-gray-400">Total Books</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">0</div>
                    <div className="text-gray-600 dark:text-gray-400">Books Read</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">0</div>
                    <div className="text-gray-600 dark:text-gray-400">To Read</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">5</div>
                    <div className="text-gray-600 dark:text-gray-400">Genres</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}