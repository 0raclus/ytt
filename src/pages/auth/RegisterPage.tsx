import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Leaf } from 'lucide-react';

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">YTT Platform</h1>
          <p className="text-muted-foreground mt-2">
            Yenilikçi Teknoloji Takımı'na Katılın
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}

