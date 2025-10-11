import React from 'react';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Sistem genel bakış ve istatistikler</p>
      </div>
      <AdminAnalytics />
    </div>
  );
}

