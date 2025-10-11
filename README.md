# YTT Platform - Yenilikçi Teknoloji Takımı

Enterprise-grade fullstack platform for plant cultivation events, botanical library, and community management.

## 🌟 Features

### Public Website
- 🏠 **Homepage** with featured events and statistics
- 📅 **Events** - Browse and register for plant cultivation events
- 🌱 **Plant Library** - Comprehensive botanical database
- 📝 **Blog** - Articles about plants and nature
- 📚 **Resources** - Downloadable guides and materials
- 👤 **User Profiles** - Personal dashboard and preferences
- 🔔 **Notifications** - Real-time updates

### Admin Panel (`/admin`)
- 📊 **Dashboard** - Analytics and system overview
- 👥 **User Management** - Manage users and roles
- 📅 **Event Management** - Full CRUD for events
- 🌿 **Plant Management** - Botanical database management
- ✍️ **Blog Management** - Create and publish articles
- 📢 **Notifications** - Send system-wide notifications
- 📁 **Resources** - Manage downloadable content
- 🔍 **Activity Logs** - Track system activity
- ⚙️ **Settings** - System configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for backend)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/0raclus/ytt.git
cd ytt
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
# .env dosyası zaten mevcut, sadece düzenleyin
```

Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. **Setup Supabase Database**
```bash
# QUICK_START.md dosyasındaki SQL script'i çalıştırın
# Veya supabase/migrations/ klasöründeki migration'ları kullanın
```

5. **Run development server**
```bash
npm run dev
```

6. **Open in browser**
```
http://localhost:5174
```

7. **Create admin account**
```
Email: ebrar@ytt.dev (otomatik admin olur)
veya
Başka bir email ile kayıt olup Supabase'de manuel admin yapın
```

📖 **Detaylı kurulum için**: [QUICK_START.md](./QUICK_START.md)

## 🔐 Default Admin Credentials

```
Email: ebrar@ytt.dev
Password: filistin
```

## 📁 Project Structure

```
ytt/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layouts/        # Layout components
│   │   ├── admin/          # Admin-specific components
│   │   └── ui/             # shadcn/ui components
│   ├── pages/              # Page components
│   │   ├── public/         # Public website pages
│   │   └── admin/          # Admin panel pages
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and configurations
│   ├── routes/             # Routing configuration
│   └── types/              # TypeScript type definitions
├── supabase/
│   └── migrations/         # Database migrations
└── public/                 # Static assets
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Radix UI** - Headless components

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Storage
  - Row Level Security

### Additional Libraries
- **date-fns** - Date manipulation
- **Recharts** - Data visualization
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icons

## 🗄️ Database Schema

The application uses Supabase with the following main tables:

- `users` - User accounts and profiles
- `events` - Plant cultivation events
- `event_registrations` - Event sign-ups
- `plants` - Botanical database
- `blog_posts` - Blog articles
- `resources` - Downloadable materials
- `notifications` - User notifications
- `audit_logs` - System activity tracking

See `supabase/migrations/` for complete schema.

## 🎨 Key Features

### Routing
- URL-based navigation
- Protected routes
- Role-based access control
- Lazy loading
- 404 handling

### Authentication
- Email/password login
- Role-based permissions (admin/user/moderator)
- Session persistence
- Automatic redirects

### Admin Features
- Complete CRUD operations
- Real-time data updates
- Search and filtering
- Bulk operations
- Analytics dashboard

### User Experience
- Responsive design
- Dark mode support
- Loading states
- Error boundaries
- Toast notifications

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## 🔒 Security

- Row Level Security (RLS) enabled
- Protected API routes
- Input validation
- XSS protection
- CSRF protection
- Secure authentication

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod
```

## 📚 Documentation

- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [State Document](./state-ytt-enterprise-upgrade.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

**Yenilikçi Teknoloji Takımı (YTT)**
- Platform for plant cultivation enthusiasts
- Community-driven events and education

## 🐛 Bug Reports

Please report bugs via GitHub Issues.

## 💬 Support

For support, email info@ytt.dev or join our community.

---

Built with ❤️ by YTT Team