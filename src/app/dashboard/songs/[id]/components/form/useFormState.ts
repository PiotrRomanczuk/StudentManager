"use client";

import { useState, useEffect, useCallback } from 'react';
import { SongInput } from '@/schemas/SongSchema';

export function useFormState(
  initialValues: Partial<SongInput> = {},
  autoSave = false,
  autoSaveInterval = 30000,
  onSubmit?: (values: SongInput) => void | Promise<void>
) {
  const [formData, setFormData] = useState<SongInput>({
    title: initialValues.title || '',
    author: initialValues.author || '',
    level: initialValues.level || 'beginner',
    key: initialValues.key || 'C',
    chords: initialValues.chords || '',
    ultimate_guitar_link: initialValues.ultimate_guitar_link || '',
    audio_files: initialValues.audio_files || {},
    short_title: initialValues.short_title || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update form data when initialValues change (for edit mode)
  useEffect(() => {
    const newFormData = {
      title: initialValues.title || '',
      author: initialValues.author || '',
      level: initialValues.level || 'beginner',
      key: initialValues.key || 'C',
      chords: initialValues.chords || '',
      ultimate_guitar_link: initialValues.ultimate_guitar_link || '',
      audio_files: initialValues.audio_files || {},
      short_title: initialValues.short_title || '',
    };
    
    // Only update if the values are actually different
    setFormData(prev => {
      const hasChanges = Object.keys(newFormData).some(key => 
        prev[key as keyof SongInput] !== newFormData[key as keyof SongInput]
      );
      return hasChanges ? newFormData : prev;
    });
  }, [
    initialValues.title,
    initialValues.author,
    initialValues.level,
    initialValues.key,
    initialValues.chords,
    initialValues.ultimate_guitar_link,
    initialValues.audio_files,
    initialValues.short_title,
  ]);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges = Object.keys(formData).some(key => {
      const initialValue = initialValues[key as keyof SongInput];
      const currentValue = formData[key as keyof SongInput];
      return initialValue !== currentValue;
    });
    setHasUnsavedChanges(hasChanges);
  }, [formData, initialValues]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !hasUnsavedChanges || !onSubmit) return;

    const timer = setTimeout(async () => {
      try {
        await onSubmit(formData);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, autoSaveInterval);

    return () => clearTimeout(timer);
  }, [formData, autoSave, hasUnsavedChanges, autoSaveInterval, onSubmit]);

  const handleFieldChange = useCallback((field: keyof SongInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (validateForm: () => boolean) => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit]);

  const handleCancel = useCallback((onCancel?: () => void) => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onCancel?.();
      }
    } else {
      onCancel?.();
    }
  }, [hasUnsavedChanges]);

  return {
    formData,
    isSubmitting,
    lastSaved,
    hasUnsavedChanges,
    handleFieldChange,
    handleSubmit,
    handleCancel,
  };
} 