"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface FormSelectProps {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export function FormSelect({
  id,
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  required = false
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.description ? (
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </div>
              ) : (
                option.label
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 