# YTT Platform - Deployment Guide

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Set up Supabase project
- [ ] Configure environment variables
- [ ] Test all features locally
- [ ] Run production build
- [ ] Check for console errors
- [ ] Test on mobile devices
- [ ] Verify all routes work
- [ ] Test authentication flow
- [ ] Verify admin panel access

### Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and anon key

2. **Run Migrations**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Push migrations
   supabase db push
   ```

3. **Configure RLS Policies**
   - All policies are defined in the migration file
   - Verify they're applied correctly in Supabase dashboard

4. **Set up Storage Buckets** (for image uploads)
   ```sql
   -- Create storage bucket for event images
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('event-images', 'event-images', true);
   
   -- Create storage bucket for plant images
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('plant-images', 'plant-images', true);
   
   -- Create storage bucket for blog images
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('blog-images', 'blog-images', true);
   ```

### Environment Variables

Create `.env` file:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
VITE_APP_NAME=YTT Platform
VITE_APP_URL=https://your-domain.com

# Admin
VITE_ADMIN_EMAIL=ebrar@ytt.dev

# Features
VITE_ENABLE_REALTIME=true
VITE_ENABLE_ANALYTICS=true

# Upload Limits
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
```

### Build for Production

```bash
# Install dependencies
npm install

# Build
npm run build

# Test production build locally
npm run preview
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Add all variables from `.env`

4. **Custom Domain** (optional)
   - Go to Domains in Vercel dashboard
   - Add your custom domain
   - Update DNS records

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   netlify deploy --prod
   ```

3. **Configure**
   - Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

4. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add all variables from `.env`

### Option 3: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**
   ```nginx
   server {
     listen 80;
     server_name _;
     root /usr/share/nginx/html;
     index index.html;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

3. **Build and Run**
   ```bash
   docker build -t ytt-platform .
   docker run -p 80:80 ytt-platform
   ```

### Option 4: AWS S3 + CloudFront

1. **Build**
   ```bash
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront**
   - Create distribution
   - Point to S3 bucket
   - Configure custom error responses (404 → /index.html)

## 🔒 Security Considerations

### Production Checklist

- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable Supabase RLS
- [ ] Use environment variables for secrets
- [ ] Enable CSP headers
- [ ] Configure secure cookies
- [ ] Set up monitoring
- [ ] Enable error tracking
- [ ] Configure backup strategy

### Recommended Headers

Add to your hosting configuration:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## 📊 Monitoring

### Recommended Tools

1. **Error Tracking**
   - Sentry
   - LogRocket
   - Rollbar

2. **Analytics**
   - Google Analytics
   - Plausible
   - Umami

3. **Performance**
   - Vercel Analytics
   - Lighthouse CI
   - Web Vitals

### Setup Sentry (Example)

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🧪 Testing Before Deployment

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Test production build
npm run preview

# Check bundle size
npm run build -- --mode production
```

## 📝 Post-Deployment

1. **Verify Deployment**
   - [ ] Homepage loads
   - [ ] All routes accessible
   - [ ] Login works
   - [ ] Admin panel accessible
   - [ ] Database operations work
   - [ ] Images load correctly
   - [ ] Forms submit properly

2. **Performance Check**
   - [ ] Run Lighthouse audit
   - [ ] Check Core Web Vitals
   - [ ] Test on slow 3G
   - [ ] Verify lazy loading works

3. **SEO**
   - [ ] Add meta tags
   - [ ] Create sitemap.xml
   - [ ] Add robots.txt
   - [ ] Submit to Google Search Console

4. **Monitoring**
   - [ ] Set up error tracking
   - [ ] Configure analytics
   - [ ] Set up uptime monitoring
   - [ ] Configure alerts

## 🆘 Troubleshooting

### Common Issues

**Issue**: Routes return 404 on refresh
**Solution**: Configure server to redirect all routes to index.html

**Issue**: Environment variables not working
**Solution**: Ensure variables start with `VITE_` and rebuild

**Issue**: Supabase connection fails
**Solution**: Check CORS settings in Supabase dashboard

**Issue**: Images not loading
**Solution**: Verify storage bucket policies and CORS

## 📞 Support

For deployment issues:
- Check [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- Review [README.md](./README.md)
- Contact: info@ytt.dev

---

**Last Updated**: 2025-10-11

