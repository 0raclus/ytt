import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Leaf } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Image - Full Screen */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/assets/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 w-full h-full bg-black/40 dark:bg-black/60" />

      {/* Content */}
      <div className="w-full max-w-md space-y-8 relative z-10 px-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3 shadow-lg">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">YTT Platform</h1>
          <p className="text-white/90 mt-2 drop-shadow">
            Yaşayan Tasarım Topluluğu
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}

