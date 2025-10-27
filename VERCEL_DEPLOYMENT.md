# Vercel Deployment Guide - YTT Platform

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/0raclus/ytt)

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Fork or clone this repo
3. **Neon Database** - PostgreSQL database (already configured)
4. **Firebase Project** - For authentication (already configured)

## 🔧 Environment Variables

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

### Required Variables:

```bash
# Neon Database
VITE_DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional
ADMIN_SECRET=your_admin_secret_key
```

## 📁 Project Structure

```
ytt/
├── api/                          # Vercel Serverless Functions
│   ├── _lib/
│   │   └── db.ts                # Database connection & utilities
│   ├── auth/
│   │   └── sync-firebase-user.ts
│   ├── events/
│   │   ├── index.ts             # GET, POST /api/events
│   │   ├── [id].ts              # GET, PUT, DELETE /api/events/:id
│   │   └── stats.ts             # GET /api/events/stats
│   ├── registrations/
│   │   ├── index.ts             # POST /api/registrations
│   │   ├── [id].ts              # DELETE /api/registrations/:id
│   │   ├── check.ts             # GET /api/registrations/check
│   │   ├── user/[userId].ts     # GET /api/registrations/user/:userId
│   │   └── event/[eventId].ts   # GET /api/registrations/event/:eventId
│   ├── profile/
│   │   └── update.ts            # PUT /api/profile/update
│   ├── categories.ts            # GET /api/categories
│   ├── users.ts                 # GET /api/users
│   ├── plants.ts                # GET /api/plants
│   └── blog.ts                  # GET /api/blog
├── src/                         # React Frontend
├── public/                      # Static Assets
├── vercel.json                  # Vercel Configuration
└── package.json
```

## 🌐 API Endpoints

### Events
- `GET /api/events` - List all events (with filters)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)
- `GET /api/events/stats` - Get event statistics

### Registrations
- `POST /api/registrations` - Register for event
- `DELETE /api/registrations/:id` - Cancel registration
- `GET /api/registrations/check` - Check if registered
- `GET /api/registrations/user/:userId` - Get user's registrations
- `GET /api/registrations/event/:eventId` - Get event's registrations (admin)

### Auth & Users
- `POST /api/auth/sync-firebase-user` - Sync Firebase user to database
- `PUT /api/profile/update` - Update user profile
- `GET /api/users` - List all users (admin)

### Other
- `GET /api/categories` - List event categories
- `GET /api/plants` - List plants
- `GET /api/blog` - List blog posts

## 🔐 Admin Configuration

Admin users are defined in `api/_lib/db.ts`:

```typescript
export const ADMIN_EMAILS = [
  'klausmullermaxwell@gmail.com',
  // Add more admin emails here
];
```

## 🚀 Deployment Steps

### 1. Connect Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select the `ytt` repository

### 2. Configure Project

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Add Environment Variables

Add all required environment variables from the list above.

### 4. Deploy

Click "Deploy" and wait for the build to complete.

### 5. Verify Deployment

After deployment, test these URLs:

- `https://your-app.vercel.app/` - Frontend
- `https://your-app.vercel.app/api/events` - API test
- `https://your-app.vercel.app/api/categories` - Categories test

## 🔄 Local Development

```bash
# Install dependencies
npm install

# Run development server (frontend + backend)
npm run dev:all

# Frontend only
npm run dev

# Backend only
npm run dev:api
```

## 📊 Database Schema

The database schema is already set up in Neon. Tables include:

- `user_profiles` - User accounts
- `events` - Event listings
- `event_categories` - Event categories
- `event_registrations` - Event registrations
- `plants` - Plant library
- `blog_posts` - Blog content

## 🐛 Troubleshooting

### Build Fails

- Check environment variables are set correctly
- Verify `VITE_DATABASE_URL` is accessible from Vercel
- Check build logs for specific errors

### API Not Working

- Verify environment variables in Vercel Dashboard
- Check API endpoint URLs (should be `/api/*`)
- Check Vercel Function logs

### Database Connection Issues

- Verify Neon database is accessible
- Check connection string format
- Ensure SSL mode is enabled (`?sslmode=require`)

## 📝 Notes

- All API endpoints use Neon PostgreSQL serverless
- Firebase handles authentication
- CORS is configured for all API endpoints
- Static assets are cached for 1 year
- API responses use `{ data, error }` format

## 🎉 Success!

Your YTT Platform is now deployed on Vercel with:

✅ Full-stack React + Vite frontend
✅ Serverless API endpoints
✅ Neon PostgreSQL database
✅ Firebase authentication
✅ Admin panel
✅ Event management
✅ User registrations
✅ Real-time statistics

## 🔗 Links

- **Production**: https://your-app.vercel.app
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Neon Dashboard**: https://console.neon.tech
- **Firebase Console**: https://console.firebase.google.com

