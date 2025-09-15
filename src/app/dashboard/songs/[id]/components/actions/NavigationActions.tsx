'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function NavigationActions() {
  const router = useRouter();

  const handleBackToSongs = () => {
    router.push('/dashboard/songs');
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Button 
          variant="outline" 
          onClick={handleBackToSongs}
          className="w-full justify-start"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Songs
        </Button>
      </CardContent>
    </Card>
  );
} 