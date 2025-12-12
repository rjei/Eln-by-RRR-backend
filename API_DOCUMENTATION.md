# ELn-by-RRR Backend API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### Authentication (`/api/auth`)

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/auth/login`
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### GET `/api/auth/profile`
Get current user profile. **Requires authentication.**

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### Courses (`/api/courses`)

#### GET `/api/courses`
Get all courses. **Public endpoint.**

**Response:**
```json
{
  "success": true,
  "courses": [
    {
      "id": 1,
      "title": "English for Beginners",
      "description": "...",
      "level": "Beginner",
      "duration": "8 minggu",
      "students": 2450,
      "rating": 4.8,
      "lessons": 32,
      "image": "..."
    }
  ]
}
```

#### GET `/api/courses/:id`
Get course by ID. **Public endpoint.**

**Response:**
```json
{
  "success": true,
  "course": {
    "id": 1,
    "title": "English for Beginners",
    "description": "...",
    "level": "Beginner",
    "Lessons": [...]
  }
}
```

#### GET `/api/courses/user/my-courses`
Get user's courses with progress. **Requires authentication.**

**Response:**
```json
{
  "success": true,
  "courses": [
    {
      "id": 1,
      "title": "English for Beginners",
      "progress": 25,
      "completedLessons": 8,
      "lessons": 32,
      "lastLesson": "Practice: Self Introduction"
    }
  ]
}
```

#### POST `/api/courses`
Create a new course. **Requires authentication.**

**Request Body:**
```json
{
  "title": "New Course",
  "description": "Course description",
  "level": "Beginner",
  "duration": "8 minggu",
  "image": "https://..."
}
```

---

### Lessons (`/api/lessons`)

#### GET `/api/lessons/course/:courseId`
Get all lessons for a course. **Public endpoint.**

**Response:**
```json
{
  "success": true,
  "lessons": [
    {
      "id": 1,
      "courseId": 1,
      "title": "Introduction",
      "content": "...",
      "order": 1,
      "duration": 30
    }
  ]
}
```

#### GET `/api/lessons/:id`
Get lesson by ID. **Public endpoint (with optional auth for progress).**

**Response:**
```json
{
  "success": true,
  "lesson": {
    "id": 1,
    "title": "Introduction",
    "content": "...",
    "userProgress": {
      "completed": false,
      "progress": 50,
      "timeSpent": 300
    }
  }
}
```

#### POST `/api/lessons`
Create a new lesson. **Requires authentication.**

**Request Body:**
```json
{
  "courseId": 1,
  "title": "New Lesson",
  "content": "Lesson content...",
  "order": 1,
  "duration": 30
}
```

---

### Progress (`/api/progress`)

#### POST `/api/progress`
Update lesson progress. **Requires authentication.**

**Request Body:**
```json
{
  "lessonId": 1,
  "progress": 100,
  "completed": true,
  "timeSpent": 600
}
```

**Response:**
```json
{
  "success": true,
  "message": "Progress berhasil diperbarui",
  "progress": {...}
}
```

#### GET `/api/progress/stats`
Get user statistics. **Requires authentication.**

**Response:**
```json
{
  "success": true,
  "stats": {
    "lessonsCompleted": 12,
    "totalTimeSpent": "3.5 jam",
    "currentStreak": 5,
    "longestStreak": 7,
    "points": 450
  }
}
```

#### GET `/api/progress`
Get all user progress. **Requires authentication.**

#### GET `/api/progress/course/:courseId`
Get user progress for a specific course. **Requires authentication.**

---

### Games (`/api/games`)

#### POST `/api/games/score`
Save game score. **Requires authentication.**

**Request Body:**
```json
{
  "gameType": "wordle",
  "score": 100,
  "level": "easy",
  "timeSpent": 120
}
```

**Valid game types:** `wordle`, `hangman`, `crossword`, `word-scramble`

#### GET `/api/games/scores`
Get user's game scores. **Requires authentication.**

**Query Parameters:**
- `gameType` (optional): Filter by game type

#### GET `/api/games/leaderboard`
Get game leaderboard. **Public endpoint.**

**Query Parameters:**
- `gameType` (optional): Filter by game type

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=eln_by_rrr
DB_USER=postgres
DB_PASS=your_password

JWT_SECRET=your_super_secret_jwt_key

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Set up your `.env` file with database and Supabase credentials

3. Start the server:
```bash
npm run dev
```

4. The server will automatically sync database models in development mode.

