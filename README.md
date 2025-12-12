# ELn-by-RRR Backend

Backend API untuk aplikasi E-Learning Bahasa Inggris menggunakan Node.js, Express, Sequelize, PostgreSQL, JWT Authentication, dan Supabase.

## 🚀 Fitur

- ✅ **JWT Authentication** - Sistem autentikasi dengan JWT token
- ✅ **User Management** - Registrasi, login, dan profil user
- ✅ **Course Management** - CRUD untuk courses
- ✅ **Lesson Management** - CRUD untuk lessons
- ✅ **Progress Tracking** - Tracking progress belajar user
- ✅ **Game Scores** - Penyimpanan score dari games (Wordle, Hangman, Crossword, Word Scramble)
- ✅ **User Statistics** - Statistik pembelajaran user (lessons completed, time spent, streak, points)
- ✅ **Supabase Integration** - Setup untuk integrasi dengan Supabase

## 📁 Struktur Project

```
src/
├── config/
│   ├── db.js              # Konfigurasi database PostgreSQL
│   └── supabase.js        # Konfigurasi Supabase client
├── controllers/
│   ├── auth.controller.js    # Controller untuk authentication
│   ├── course.controller.js  # Controller untuk courses
│   ├── lesson.controller.js   # Controller untuk lessons
│   ├── progress.controller.js # Controller untuk progress tracking
│   └── game.controller.js     # Controller untuk game scores
├── middleware/
│   └── auth.middleware.js     # JWT authentication middleware
├── models/
│   ├── index.js              # Inisialisasi semua models dan associations
│   ├── user.model.js         # User model
│   ├── course.model.js       # Course model
│   ├── lesson.model.js       # Lesson model
│   ├── progress.model.js     # Progress model
│   ├── gameScore.model.js    # GameScore model
│   └── userStats.model.js    # UserStats model
├── routes/
│   ├── auth.routes.js        # Routes untuk authentication
│   ├── course.routes.js      # Routes untuk courses
│   ├── lesson.routes.js      # Routes untuk lessons
│   ├── progress.routes.js    # Routes untuk progress
│   └── game.routes.js        # Routes untuk games
├── app.js                    # Express app configuration
└── server.js                 # Server entry point
```

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Buat file `.env` di root directory berdasarkan `.env.example`:

```env
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eln_by_rrr
DB_USER=postgres
DB_PASS=your_password

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database

Pastikan PostgreSQL sudah terinstall dan running. Database akan dibuat otomatis saat pertama kali menjalankan aplikasi (dalam development mode).

### 4. Run Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## 📡 API Endpoints

Lihat [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) untuk dokumentasi lengkap semua endpoints.

### Quick Reference

**Authentication:**
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

**Courses:**
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `GET /api/courses/user/my-courses` - Get user courses with progress (protected)
- `POST /api/courses` - Create course (protected)

**Lessons:**
- `GET /api/lessons/course/:courseId` - Get lessons by course
- `GET /api/lessons/:id` - Get lesson by ID
- `POST /api/lessons` - Create lesson (protected)

**Progress:**
- `POST /api/progress` - Update progress (protected)
- `GET /api/progress/stats` - Get user stats (protected)
- `GET /api/progress` - Get all user progress (protected)

**Games:**
- `POST /api/games/score` - Save game score (protected)
- `GET /api/games/scores` - Get user scores (protected)
- `GET /api/games/leaderboard` - Get leaderboard

## 🔐 Authentication

Semua endpoint yang memerlukan authentication menggunakan JWT token. Setelah login/register, gunakan token yang dikembalikan di header:

```
Authorization: Bearer <your_jwt_token>
```

## 🗄️ Database Models

### User
- id, name, email, password, role, createdAt, updatedAt

### Course
- id, title, description, level, duration, students, rating, lessons, image

### Lesson
- id, courseId, title, content, order, duration

### Progress
- id, userId, courseId, lessonId, completed, progress, timeSpent, completedAt

### GameScore
- id, userId, gameType, score, level, timeSpent

### UserStats
- id, userId, lessonsCompleted, totalTimeSpent, currentStreak, longestStreak, points

## 🔧 Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Sequelize** - ORM untuk PostgreSQL
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Supabase** - Backend as a Service (optional)

## 📝 Notes

- Database models akan di-sync otomatis saat development mode
- Untuk production, gunakan migrations instead of sync
- JWT token expires dalam 7 hari
- Password di-hash menggunakan bcrypt dengan salt rounds 10

## 🐛 Troubleshooting

**Database connection error:**
- Pastikan PostgreSQL sudah running
- Check credentials di `.env` file
- Pastikan database sudah dibuat atau Sequelize akan membuatnya otomatis

**JWT errors:**
- Pastikan `JWT_SECRET` sudah di-set di `.env`
- Pastikan token dikirim dengan format `Bearer <token>`

## 📄 License

ISC

