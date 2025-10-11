import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { Loader2 } from 'lucide-react';

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
      <p className="text-muted-foreground">Yükleniyor...</p>
    </div>
  </div>
);

const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));

const HomePage = lazy(() => import('@/pages/public/HomePage').then(m => ({ default: m.HomePage })));
const EventsPage = lazy(() => import('@/pages/public/EventsPage').then(m => ({ default: m.EventsPage })));
const EventDetailPage = lazy(() => import('@/pages/public/EventDetailPage').then(m => ({ default: m.EventDetailPage })));
const PlantsPage = lazy(() => import('@/pages/public/PlantsPage').then(m => ({ default: m.PlantsPage })));
const PlantDetailPage = lazy(() => import('@/pages/public/PlantDetailPage').then(m => ({ default: m.PlantDetailPage })));
const BlogPage = lazy(() => import('@/pages/public/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('@/pages/public/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const ResourcesPage = lazy(() => import('@/pages/public/ResourcesPage').then(m => ({ default: m.ResourcesPage })));
const ProfilePage = lazy(() => import('@/pages/public/ProfilePage').then(m => ({ default: m.ProfilePage })));
const NotificationsPage = lazy(() => import('@/pages/public/NotificationsPage').then(m => ({ default: m.NotificationsPage })));

const AdminDashboardPage = lazy(() => import('@/pages/admin/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AdminUsersPage = lazy(() => import('@/pages/admin/UsersPage').then(m => ({ default: m.UsersPage })));
const AdminEventsPage = lazy(() => import('@/pages/admin/EventsPage').then(m => ({ default: m.EventsPage })));
const AdminPlantsPage = lazy(() => import('@/pages/admin/PlantsPage').then(m => ({ default: m.PlantsPage })));
const AdminBlogPage = lazy(() => import('@/pages/admin/BlogPage').then(m => ({ default: m.BlogPage })));
const AdminResourcesPage = lazy(() => import('@/pages/admin/ResourcesPage').then(m => ({ default: m.ResourcesPage })));
const AdminNotificationsPage = lazy(() => import('@/pages/admin/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const AdminActivityPage = lazy(() => import('@/pages/admin/ActivityPage').then(m => ({ default: m.ActivityPage })));
const AdminSettingsPage = lazy(() => import('@/pages/admin/SettingsPage').then(m => ({ default: m.SettingsPage })));

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'events',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <EventsPage />
          </Suspense>
        ),
      },
      {
        path: 'events/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <EventDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'plants',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PlantsPage />
          </Suspense>
        ),
      },
      {
        path: 'plants/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PlantDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'blog',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BlogPage />
          </Suspense>
        ),
      },
      {
        path: 'blog/:slug',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BlogPostPage />
          </Suspense>
        ),
      },
      {
        path: 'resources',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ResourcesPage />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <ProfilePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'notifications',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <NotificationsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
];

const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'users',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminUsersPage />
          </Suspense>
        ),
      },
      {
        path: 'events',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminEventsPage />
          </Suspense>
        ),
      },
      {
        path: 'plants',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminPlantsPage />
          </Suspense>
        ),
      },
      {
        path: 'blog',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminBlogPage />
          </Suspense>
        ),
      },
      {
        path: 'resources',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminResourcesPage />
          </Suspense>
        ),
      },
      {
        path: 'notifications',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminNotificationsPage />
          </Suspense>
        ),
      },
      {
        path: 'activity',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminActivityPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminSettingsPage />
          </Suspense>
        ),
      },
    ],
  },
];

const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: '/auth/forgot-password',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ForgotPasswordPage />
      </Suspense>
    ),
  },
];

export const router = createBrowserRouter([
  ...publicRoutes,
  ...adminRoutes,
  ...authRoutes,
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

