import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { EventProvider } from '@/contexts/EventContext';
import { Login } from '@/components/Login';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminDashboard } from '@/components/AdminDashboard';
import { PublicWebsite } from '@/components/PublicWebsite';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function AppContent() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (isAdmin) {
    return (
      <ProtectedRoute requireAdmin>
        <EventProvider>
          <AdminDashboard />
        </EventProvider>
      </ProtectedRoute>
    );
  }

  return (
    <EventProvider>
      <PublicWebsite />
    </EventProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
