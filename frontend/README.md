# Task Manager Frontend

Production-ready React app built with Vite and Tailwind CSS v4.

## Tech Stack

- React 18.2 & Vite 5
- Tailwind CSS v4 (NO PostCSS!)
- React Router 6
- Axios
- React Toastify
- Context API

## Quick Start

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000`

## Environment Variables (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Features

✅ User authentication (Login, Register, Logout)  
✅ Task CRUD operations  
✅ Filters (status, priority, search)  
✅ Pagination (10 tasks per page)  
✅ Real-time statistics  
✅ Toast notifications  
✅ Responsive design (mobile-first)  
✅ Protected routes

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js           # Axios instance
│   ├── components/
│   │   ├── Navbar.jsx         # Navigation
│   │   ├── ProtectedRoute.jsx # Route guard
│   │   ├── TaskCard.jsx       # Task display
│   │   └── TaskForm.jsx       # Create task
│   ├── context/
│   │   └── AuthContext.jsx    # Auth state
│   ├── pages/
│   │   ├── Login.jsx          # Login page
│   │   ├── Register.jsx       # Register page
│   │   ├── Dashboard.jsx      # Main page
│   │   └── NotFound.jsx       # 404 page
│   ├── utils/
│   │   └── pagination.js      # Pagination helpers
│   ├── App.jsx                # Routes & providers
│   ├── main.jsx               # Entry point
│   └── index.css              # Tailwind styles
├── .env                       # Environment variables
├── vite.config.js             # Vite config
└── package.json
```

## Tailwind CSS v4

This project uses **Tailwind CSS v4** (alpha):

✅ Uses `@tailwindcss/vite` plugin  
✅ NO `postcss.config.js`  
✅ NO `tailwind.config.js`  
✅ Simpler, faster setup  

**vite.config.js:**
```javascript
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()]
});
```

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Routes

```
/login      → Login page (public)
/register   → Register page (public)
/           → Dashboard (protected)
/*          → 404 Not Found
```

## API Integration

Axios instance configured with:
- Base URL from environment
- `withCredentials: true` for cookies
- Global error handling
- Auto-redirect on 401

**Example:**
```javascript
import api from './api/axios';

// Get tasks
const tasks = await api.get('/tasks');

// Create task
const newTask = await api.post('/tasks', {
  title: 'My Task',
  status: 'todo',
  priority: 'high'
});
```

## Custom CSS Classes

```css
.btn             # Base button
.btn-primary     # Blue button
.btn-secondary   # Gray button
.btn-danger      # Red button
.input           # Input field
.input-error     # Error state input
```

## Authentication Flow

1. User logs in → Backend sets HTTP-only cookie
2. On page load → Call `/auth/me` to check session
3. Protected routes → Redirect to login if not authenticated
4. On logout → Backend clears cookie

## TODOs

- [ ] Add unit tests (Vitest + React Testing Library)
- [ ] Add TypeScript for type safety
- [ ] Add form validation (React Hook Form)
- [ ] Add error boundaries
- [ ] Deploy to production

---

Built with React best practices and Tailwind CSS v4.
