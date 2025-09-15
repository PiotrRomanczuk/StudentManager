"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X, Music, User, Calendar, Clock } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

interface EnhancedFiltersProps {
  filters: {
    [key: string]: string;
  };
  filterOptions: {
    [key: string]: FilterOption[];
  };
  onFilterChange: (filterKey: string, value: string) => void;
  onClearAll: () => void;
  className?: string;
}

export function EnhancedFilters({
  filters,
  filterOptions,
  onFilterChange,
  onClearAll,
  className = ""
}: EnhancedFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(value => value && value !== 'All');

  const getFilterIcon = (filterKey: string) => {
    switch (filterKey.toLowerCase()) {
      case 'level':
        return <Music className="h-4 w-4" />;
      case 'author':
      case 'student':
      case 'teacher':
        return <User className="h-4 w-4" />;
      case 'date':
      case 'created':
        return <Calendar className="h-4 w-4" />;
      case 'time':
        return <Clock className="h-4 w-4" />;
      default:
        return <Filter className="h-4 w-4" />;
    }
  };

  const getFilterColor = (filterKey: string) => {
    switch (filterKey.toLowerCase()) {
      case 'level':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'author':
      case 'student':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'teacher':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'date':
      case 'created':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'time':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
          >
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(filterOptions).map(([filterKey, options]) => (
          <div key={filterKey} className="space-y-2">
            <label className="text-sm font-medium text-gray-700 capitalize">
              {filterKey.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <Select
              value={filters[filterKey] || 'All'}
              onValueChange={(value) => onFilterChange(filterKey, value)}
            >
              <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder={`Select ${filterKey}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.icon && (
                        <div className={`p-1 rounded ${option.color || getFilterColor(filterKey)}`}>
                          {option.icon}
                        </div>
                      )}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (value && value !== 'All') {
                const option = filterOptions[key]?.find(opt => opt.value === value);
                return (
                  <Badge
                    key={key}
                    variant="outline"
                    className={`${getFilterColor(key)} flex items-center gap-1`}
                  >
                    {getFilterIcon(key)}
                    {option?.label || value}
                    <button
                      onClick={() => onFilterChange(key, 'All')}
                      className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
} 