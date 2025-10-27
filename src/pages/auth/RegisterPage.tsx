import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Leaf } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative p-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/assets/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3 shadow-lg">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">YTT Platform</h1>
          <p className="text-white/90 mt-2 drop-shadow">
            Yaşayan Tasarım Topluluğu'na Katılın
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}

