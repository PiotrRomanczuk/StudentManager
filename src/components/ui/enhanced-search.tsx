"use client";

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';

interface EnhancedSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  placeholder?: string;
  className?: string;
}

export function EnhancedSearch({ 
  searchTerm, 
  onSearchChange, 
  onClear, 
  hasActiveFilters,
  placeholder = "Search...",
  className = ""
}: EnhancedSearchProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
      
      {hasActiveFilters && (
        <div className="mt-3 flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Active filters:</span>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {searchTerm ? `Search: "${searchTerm}"` : 'Filters applied'}
          </Badge>
        </div>
      )}
    </div>
  );
} 