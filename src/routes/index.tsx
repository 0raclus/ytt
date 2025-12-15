import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { Loader2 } from 'lucide-react';

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
      <p className="text-muted-foreground">Yükleniyor...</p>
    </div>
  </div>
);

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));

const HomePage = lazy(() => import('@/pages/public/HomePage'));
const EventsPage = lazy(() => import('@/pages/public/EventsPage'));
const EventDetailPage = lazy(() => import('@/pages/public/EventDetailPage'));
// const PlantsPage = lazy(() => import('@/pages/public/PlantsPage'));
// const PlantDetailPage = lazy(() => import('@/pages/public/PlantDetailPage'));
// const BlogPage = lazy(() => import('@/pages/public/BlogPage'));
// const BlogPostPage = lazy(() => import('@/pages/public/BlogPostPage'));
// const ResourcesPage = lazy(() => import('@/pages/public/ResourcesPage'));
const ProfilePage = lazy(() => import('@/pages/public/ProfilePage'));
const NotificationsPage = lazy(() => import('@/pages/public/NotificationsPage'));
const TeamPage = lazy(() => import('@/pages/public/TeamPage'));

const AdminDashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/UsersPage'));
const AdminEventsPage = lazy(() => import('@/pages/admin/EventsPage'));
const AdminPlantsPage = lazy(() => import('@/pages/admin/PlantsPage'));
const AdminBlogPage = lazy(() => import('@/pages/admin/BlogPage'));
const AdminResourcesPage = lazy(() => import('@/pages/admin/ResourcesPage'));
const AdminNotificationsPage = lazy(() => import('@/pages/admin/NotificationsPage'));
const AdminActivityPage = lazy(() => import('@/pages/admin/ActivityPage'));
const AdminSettingsPage = lazy(() => import('@/pages/admin/SettingsPage'));

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <RouteErrorBoundary />,
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
      // {
      //   path: 'plants',
      //   element: (
      //     <Suspense fallback={<LoadingFallback />}>
      //       <PlantsPage />
      //     </Suspense>
      //   ),
      // },
      // {
      //   path: 'plants/:id',
      //   element: (
      //     <Suspense fallback={<LoadingFallback />}>
      //       <PlantDetailPage />
      //     </Suspense>
      //   ),
      // },
      // {
      //   path: 'blog',
      //   element: (
      //     <Suspense fallback={<LoadingFallback />}>
      //       <BlogPage />
      //     </Suspense>
      //   ),
      // },
      // {
      //   path: 'blog/:slug',
      //   element: (
      //     <Suspense fallback={<LoadingFallback />}>
      //       <BlogPostPage />
      //     </Suspense>
      //   ),
      // },
      // {
      //   path: 'resources',
      //   element: (
      //     <Suspense fallback={<LoadingFallback />}>
      //       <ResourcesPage />
      //     </Suspense>
      //   ),
      // },
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
      {
        path: 'team',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <TeamPage />
          </Suspense>
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
    errorElement: <RouteErrorBoundary />,
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

export const router = createBrowserRouter(
  [
    ...publicRoutes,
    ...adminRoutes,
    ...authRoutes,
    {
      path: '*',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <NotFoundPage />
        </Suspense>
      ),
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

