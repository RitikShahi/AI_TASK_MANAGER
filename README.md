# 🤖 AI-Powered Task Manager

An intelligent task management application that leverages Google Gemini AI to generate personalized learning tasks. Built with Next.js, Firebase Authentication, and PostgreSQL, featuring a modern dark/light theme UI with orange accent highlights.

## ✨ Features

### 🔐 Authentication
- Firebase Authentication with email/password
- Google OAuth integration
- Secure user session management

### 🧠 AI-Powered Task Generation
- Generate 5 progressive learning tasks for any topic using Google Gemini AI
- Personalized task recommendations based on skill level
- Smart task categorization and tagging

### 📝 Task Management
- Create manual tasks with priority levels (High, Medium, Low)
- Set due dates and descriptions
- Full CRUD operations (Create, Read, Update, Delete)
- Task completion tracking with visual feedback
- Bulk delete functionality

### 🔍 Advanced Filtering & Search
- Search tasks by title and description
- Filter by completion status (Completed, Pending)
- Filter by priority levels
- Filter by AI-generated topics
- Real-time filter updates

### 📊 Progress Visualization
- Circular progress indicators
- Weekly activity charts
- Priority breakdown analytics
- Topic-specific progress tracking
- Streak counters for motivation
- Task source analysis (AI vs Manual)

### 🎨 Modern UI/UX
- Dark and light theme support
- Orange accent color scheme
- Responsive design for all devices
- Smooth animations and transitions
- Clean, professional interface

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Beautiful icon library
- **Shadcn/ui** - Modern component library

### Backend & Database
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe database toolkit
- **Firebase Authentication** - User management
- **Google Gemini AI** - Task generation

### Deployment
- **Netlify** - ai-task-manager-5.netlify.app
- **Render.com** -https://ai-task-manager-4.onrender.com

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Firebase project with Authentication enabled
- Google Gemini API key

### Installation

1. **Clone the repository:**

2. **Install dependencies:**

3. **Environment Setup:**

Create a `.env.local` file in the root directory:

Firebase Authentication
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

Database
DATABASE_URL=postgresql://username:password@localhost:5432/taskmanager

4. **Database Setup:**

For local development with Docker:

Push the database schema:

6. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Getting Started
1. **Sign Up/Sign In** - Create an account or sign in with Google
2. **Generate AI Tasks** - Enter a learning topic (e.g., "Learn Python Programming")
3. **Manage Tasks** - Mark tasks as complete, change priorities, or delete them
4. **Track Progress** - View your analytics and progress charts
5. **Customize Experience** - Toggle between dark and light themes

### AI Task Generation Examples
- "Learn JavaScript" → 5 progressive JS learning tasks
- "Master Photography" → Camera settings, composition, editing tasks
- "Study Data Science" → Python, statistics, ML project tasks

## 🚀 Deployment

### Frontend (Netlify)

1. **Build Configuration:**

2. **Environment Variables:**
Set all `NEXT_PUBLIC_*` variables in Netlify dashboard

### Backend (Render.com-)

1. **Create PostgreSQL Database** on Render
2. **Deploy as Web Service:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3. **Set Environment Variables:**
   - `DATABASE_URL` (from Render PostgreSQL)
   - `GEMINI_API_KEY`
   - All Firebase config variables

## 📁 Project Structure

