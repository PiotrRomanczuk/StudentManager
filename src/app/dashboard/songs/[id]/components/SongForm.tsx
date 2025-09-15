"use client";

import React from 'react';
import { SongForm as ModularSongForm } from './form';
import { SongInput } from '@/schemas/SongSchema';

interface SongFormProps {
  initialValues?: Partial<SongInput>;
  onSubmit: (values: SongInput) => void | Promise<void>;
  mode: 'create' | 'edit';
  isLoading?: boolean;
  onCancel?: () => void;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export function SongForm(props: SongFormProps) {
  return <ModularSongForm {...props} />;
} 