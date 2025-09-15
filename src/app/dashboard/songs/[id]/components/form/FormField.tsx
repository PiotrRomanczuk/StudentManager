"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  error?: string;
  isValid?: boolean;
  isInvalid?: boolean;
  className?: string;
}

export function FormField({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  disabled = false,
  required = false,
  maxLength,
  error,
  isValid = false,
  isInvalid = false,
  className = ""
}: FormFieldProps) {
  const characterCount = value.length;
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center justify-between">
        {label} {required && <span className="text-red-500">*</span>}
        {maxLength && (
          <span className="text-xs text-muted-foreground">
            {characterCount}/{maxLength}
          </span>
        )}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={`${isInvalid ? 'border-red-500' : isValid ? 'border-green-500' : ''} ${className}`}
        placeholder={placeholder}
        type={type}
        maxLength={maxLength}
      />
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
} 