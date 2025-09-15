"use client";

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DataCardProps {
  children: ReactNode;
  className?: string;
}

export function DataCard({ children, className = "" }: DataCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}

export { Card, CardContent }; 