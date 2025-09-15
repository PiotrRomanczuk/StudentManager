"use client";

import { useState, useCallback } from 'react';
import { validateURL } from '@/schemas/CommonSchema';
import { FIELD_MAX_LENGTHS } from './constants';


interface FormErrors {
  [key: string]: string;
}

interface FormTouched {
  [key: string]: boolean;
}

export function useFormValidation() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateField = useCallback((field: string, value: any): string => {
    switch (field) {
      case 'title':
        if (!value?.trim()) return 'Title is required';
        if (value.length > FIELD_MAX_LENGTHS.title) return `Title must be ${FIELD_MAX_LENGTHS.title} characters or less`;
        return '';
      
      case 'author':
        if (!value?.trim()) return 'Author is required';
        if (value.length > FIELD_MAX_LENGTHS.author) return `Author name must be ${FIELD_MAX_LENGTHS.author} characters or less`;
        return '';
      
      case 'short_title':
        // Short title is auto-generated, so we don't need to validate it in the form
        return '';
      
      case 'ultimate_guitar_link':
        if (value && !validateURL(value)) return 'Please enter a valid URL';
        return '';
      
      default:
        return '';
    }
  }, []);

  const validateForm = useCallback((formData: Record<string, unknown>): boolean => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach((field) => {
      // Skip short_title validation since it's auto-generated
      if (field === 'short_title') return;
      
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField]);

  const isFormValid = useCallback((formData: Record<string, unknown>): boolean => {
    // Check if required fields are filled
    const hasRequiredFields = (formData.title as string)?.trim() !== '' && 
                             (formData.author as string)?.trim() !== '';
    
    return hasRequiredFields;
  }, []);

  const handleFieldChange = useCallback((field: string) => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setTouched(prev => ({ ...prev, [field]: true }));
  }, [errors]);

  const handleFieldBlur = useCallback((field: string, value: unknown) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  }, [validateField]);

  const getFieldError = useCallback((field: string): string => {
    return touched[field] ? errors[field] || '' : '';
  }, [touched, errors]);

  const isFieldValid = useCallback((field: string): boolean => {
    return touched[field] && !errors[field];
  }, [touched, errors]);

  const isFieldInvalid = useCallback((field: string): boolean => {
    return touched[field] && !!errors[field];
  }, [touched, errors]);

  return {
    errors,
    touched,
    validateField,
    validateForm,
    isFormValid,
    handleFieldChange,
    handleFieldBlur,
    getFieldError,
    isFieldValid,
    isFieldInvalid,
  };
} 