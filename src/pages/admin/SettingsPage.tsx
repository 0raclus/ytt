import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-12 text-center">
          <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sistem Ayarları</h2>
          <p className="text-muted-foreground">Yakında eklenecek</p>
        </CardContent>
      </Card>
    </div>
  );
}
