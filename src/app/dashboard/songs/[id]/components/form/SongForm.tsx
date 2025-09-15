"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';
import { SongInput } from '@/schemas/SongSchema';
import { FormField } from './FormField';
import { FormSelect } from './FormSelect';
import { FormTextarea } from './FormTextarea';
import { FormActions } from './FormActions';
import { FormStatus } from './FormStatus';
import { FormAuthorSearch } from './FormAuthorSearch';
import { useFormValidation } from './useFormValidation';
import { useFormState } from './useFormState';
import { DIFFICULTY_LEVELS, MUSIC_KEYS, FIELD_MAX_LENGTHS } from './constants';
import { generateShortTitleWithMaxLength } from '../../../utils';

interface SongFormProps {
  initialValues?: Partial<SongInput>;
  onSubmit: (values: SongInput) => void | Promise<void>;
  mode: 'create' | 'edit';
  isLoading?: boolean;
  onCancel?: () => void;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export function SongForm({ 
  initialValues = {}, 
  onSubmit, 
  mode, 
  isLoading = false,
  onCancel,
  autoSave = false,
  autoSaveInterval = 30000
}: SongFormProps) {
  const {
    formData,
    isSubmitting,
    lastSaved,
    hasUnsavedChanges,
    handleFieldChange,
    handleSubmit,
    handleCancel,
  } = useFormState(initialValues, autoSave, autoSaveInterval, onSubmit);

  const {
    validateForm,
    isFormValid,
    handleFieldBlur,
    getFieldError,
    isFieldValid,
    isFieldInvalid,
  } = useFormValidation();

  const handleFormSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Auto-generate short title from the main title if not provided
    if (formData.title && !formData.short_title) {
      const generatedShortTitle = generateShortTitleWithMaxLength(formData.title, FIELD_MAX_LENGTHS.short_title);
      handleFieldChange('short_title', generatedShortTitle);
    }
    
    await handleSubmit(() => validateForm(formData));
  };

  const handleCancelClick = () => {
    handleCancel(onCancel);
  };



  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          {mode === 'create' ? 'Add New Song' : 'Edit Song'}
        </CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'Fill in the details to add a new song to your collection. Short title will be auto-generated from the main title.'
            : 'Update the song information. Short title will be auto-generated from the main title.'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <FormStatus
            hasUnsavedChanges={hasUnsavedChanges}
            lastSaved={lastSaved}
            autoSave={autoSave}
          />

          {/* Title Field */}
          <FormField
            id="title"
            label="Title"
            value={formData.title || ''}
            onChange={(value) => handleFieldChange('title', value)}
            onBlur={() => handleFieldBlur('title', formData.title)}
            placeholder="Enter song title"
            disabled={isLoading || isSubmitting}
            required
            maxLength={FIELD_MAX_LENGTHS.title}
            error={getFieldError('title')}
            isValid={isFieldValid('title')}
            isInvalid={isFieldInvalid('title')}
          />

          {/* Author Field */}
          <FormAuthorSearch
            id="author"
            label="Author"
            value={formData.author || ''}
            onChange={(value) => handleFieldChange('author', value)}
            onBlur={() => handleFieldBlur('author', formData.author)}
            placeholder="Search for an artist..."
            disabled={isLoading || isSubmitting}
            required
            error={getFieldError('author')}
            isValid={isFieldValid('author')}
            isInvalid={isFieldInvalid('author')}
          />

          {/* Level and Key Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              id="level"
              label="Difficulty Level"
              value={formData.level}
              onValueChange={(value) => handleFieldChange('level', value)}
              options={DIFFICULTY_LEVELS}
              placeholder="Select difficulty level"
              disabled={isLoading || isSubmitting}
            />

            <FormSelect
              id="key"
              label="Key"
              value={formData.key}
              onValueChange={(value) => handleFieldChange('key', value)}
              options={MUSIC_KEYS}
              placeholder="Select key"
              disabled={isLoading || isSubmitting}
            />
          </div>

          {/* Chords Field */}
          <FormTextarea
            id="chords"
            label="Chords"
            value={formData.chords || ''}
            onChange={(value) => handleFieldChange('chords', value)}
            placeholder="e.g., G, C, D, Em, Am"
            disabled={isLoading || isSubmitting}
            helperText="Enter the chord progression separated by commas"
          />

          {/* Ultimate Guitar Link */}
          <FormField
            id="ultimate_guitar_link"
            label="Ultimate Guitar Link"
            value={formData.ultimate_guitar_link || ''}
            onChange={(value) => handleFieldChange('ultimate_guitar_link', value)}
            onBlur={() => handleFieldBlur('ultimate_guitar_link', formData.ultimate_guitar_link)}
            placeholder="https://tabs.ultimate-guitar.com/..."
            type="url"
            disabled={isLoading || isSubmitting}
            error={getFieldError('ultimate_guitar_link')}
            isInvalid={isFieldInvalid('ultimate_guitar_link')}
          />



          {/* Form Actions */}
          <FormActions
            onSubmit={handleFormSubmit}
            onCancel={handleCancelClick}
            submitText={mode === 'create' ? 'Add Song' : 'Update Song'}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            disabled={!isFormValid(formData)}
            mode={mode}
          />
        </form>
      </CardContent>
    </Card>
  );
} 