import React from 'react';
import { EventManager } from '@/components/EventManager';

export function EventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Etkinlik Yönetimi</h1>
        <p className="text-muted-foreground">Etkinlikleri oluştur, düzenle ve yönet</p>
      </div>
      <EventManager />
    </div>
  );
}

