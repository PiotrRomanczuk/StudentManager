"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';

interface FormActionsProps {
  onSubmit: (e?: React.FormEvent | undefined) => void | Promise<void>;
  onCancel?: () => void;
  submitText: string;
  cancelText?: string;
  isLoading?: boolean;
  isSubmitting?: boolean;
  disabled?: boolean;
  mode?: 'create' | 'edit';
}

export function FormActions({
  onSubmit,
  onCancel,
  submitText,
  cancelText = "Cancel",
  isLoading = false,
  isSubmitting = false,
  disabled = false,
  mode = 'create'
}: FormActionsProps) {
  const loadingText = mode === 'create' ? 'Adding...' : 'Updating...';
  
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4">
      <Button 
        type="submit" 
        onClick={onSubmit}
        disabled={isLoading || isSubmitting || disabled}
        className="flex-1"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText}
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            {submitText}
          </>
        )}
      </Button>
      
      {onCancel && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading || isSubmitting}
          className="flex-1"
        >
          {cancelText}
        </Button>
      )}
    </div>
  );
} 