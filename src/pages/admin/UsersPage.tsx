import React from 'react';
import { UserManagement } from '@/components/admin/UserManagement';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
        <p className="text-muted-foreground">Kullanıcıları görüntüle ve yönet</p>
      </div>
      <UserManagement />
    </div>
  );
}

