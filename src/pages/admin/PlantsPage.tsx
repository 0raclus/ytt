import React from 'react';
import { PlantManagement } from '@/components/admin/PlantManagement';

export default function PlantsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bitki Yönetimi</h1>
        <p className="text-muted-foreground">Bitki kütüphanesini yönet</p>
      </div>
      <PlantManagement />
    </div>
  );
}

