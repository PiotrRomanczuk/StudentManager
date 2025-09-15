"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, Loader2, Search } from 'lucide-react';

interface FormAuthorSearchProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  isValid?: boolean;
  isInvalid?: boolean;
  className?: string;
}

export function FormAuthorSearch({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder = "Search for an artist...",
  disabled = false,
  required = false,
  error,
  isValid = false,
  isInvalid = false,
  className = ""
}: FormAuthorSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [authors, setAuthors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(value || "");
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch authors when search value changes
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (searchValue.length >= 2 || searchValue.length === 0) {
        setLoading(true);
        try {
          const params = new URLSearchParams();
          if (searchValue) {
            params.append('search', searchValue);
          }
          params.append('limit', '10');

          const response = await fetch(`/api/song/authors?${params}`);
          if (response.ok) {
            const data = await response.json();
            setAuthors(data.authors || []);
          }
        } catch (error) {
          console.error('Error fetching authors:', error);
        } finally {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchValue]);

  // Load initial authors when component mounts
  useEffect(() => {
    const loadInitialAuthors = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/song/authors?limit=5');
        if (response.ok) {
          const data = await response.json();
          setAuthors(data.authors || []);
        }
      } catch (error) {
        console.error('Error fetching initial authors:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialAuthors();
  }, []);

  const handleInputChange = (inputValue: string) => {
    setSearchValue(inputValue);
    onChange(inputValue);
    setShowSuggestions(true);
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setSearchValue(selectedValue);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
    onBlur?.();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="flex items-center justify-between">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            id={id}
            value={searchValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`pl-10 pr-10 ${isInvalid ? 'border-red-500' : isValid ? 'border-green-500' : ''}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => setShowSuggestions(!showSuggestions)}
            disabled={disabled}
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${showSuggestions ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {showSuggestions && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Loading...</span>
              </div>
            ) : authors.length > 0 ? (
              <div className="py-1">
                {authors.map((author) => (
                  <button
                    key={author}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    onClick={() => handleSelect(author)}
                  >
                    {author}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-2 text-gray-500">
                No authors found
              </div>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
} 