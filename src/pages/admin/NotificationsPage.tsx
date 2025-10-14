import React from 'react';
import { NotificationManagement } from '@/components/admin/NotificationManagement';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bildirim Yönetimi</h1>
        <p className="text-muted-foreground">Bildirimleri oluştur ve gönder</p>
      </div>
      <NotificationManagement />
    </div>
  );
}

