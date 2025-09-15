"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

interface FormStatusProps {
  hasUnsavedChanges?: boolean;
  lastSaved?: Date | null;
  autoSave?: boolean;
  showRequiredFieldsInfo?: boolean;
}

export function FormStatus({
  hasUnsavedChanges = false,
  lastSaved = null,
  autoSave = false,
  showRequiredFieldsInfo = true
}: FormStatusProps) {
  return (
    <>
      {/* Auto-save indicator */}
      {autoSave && hasUnsavedChanges && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Auto-saving in progress... {lastSaved && (
              <span className="text-sm text-muted-foreground">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Form Status */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Badge variant="secondary" className="text-xs">
              Unsaved changes
            </Badge>
          )}
          {lastSaved && (
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          )}
        </div>
        
        {showRequiredFieldsInfo && (
          <div className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>Fields marked with * are required</span>
          </div>
        )}
      </div>
    </>
  );
} 