# 🚀 Quick Start Guide

Get the Task Management Application running in 5 minutes.

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)

## Setup

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Frontend Setup (New Terminal)

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies (already done, but run if needed)
npm install

# Start frontend development server
npm run dev
```

✅ **Frontend is now running on http://localhost:3000**

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

cd Using the App

1. **Register**: Click "Sign up" and create an account
2. **Create Task**: Click "Create a new task..." on Dashboard
3. **Manage**: Edit/Delete tasks, change status, filter, searchckend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

### Stopping the Servers

Press `Ctrl + C` in each terminal to stop the servers.

## 🔍 Troubleshooting

### Issue: MongoDB Connection Error

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**:
1. **If using local MongoDB**:
   ```bash
   # Windows (run as Administrator)
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **If using MongoDB Atlas**:
   - Update `MONGO_URI` in `backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
   ```

###env
   VITE_API_BASE_URL=http://localhost:5001/api
   ```

### Issue: npm install fails

**Error**: Network errors during installation

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install

**MongoDB not connecting?**
- Start MongoDB: `net start MongoDB` (Windows) or check if Atlas connection string is correct in `backend/.env`

**Port already in use?**
- Kill process or change PORT in `backend/.env`

**CORS errors?**
- Ensure `FRONTEND_URL=http://localhost:3000` in `backend/.env`

## Tech Stack

**Frontend**: React 18, Vite 5, Tailwind CSS v4, React Router, Axios  
**Backend**: Node.js, Express, MongoDB, Mongoose, JWT  
**Security**: bcrypt, HTTP-only cookies, Helmet, Rate limiting

## TODOs

- [ ] Run both backend and frontend servers
- [ ] Register a new account
- [ ] Create your first task
- [ ] Add tests and TypeScript
- [ ] Deploy to production

---

That's it! You're ready to build. 🚀