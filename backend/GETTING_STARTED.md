# 🚀 Getting Started - Quick Setup Guide

## ⚡ Installation & Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
1. Copy the example environment file:
   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env
   
   # Linux/Mac
   cp .env.example .env
   ```

2. Edit `.env` file and update these CRITICAL values:
   ```env
   # Change this to a strong random string (32+ characters)
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars_12345678
   
   # Change this to a 32-character encryption key
   ENCRYPTION_KEY=change_me_32_character_key_!!!!
   
   # Update MongoDB connection (use Atlas or local)
   MONGO_URI=mongodb://localhost:27017/taskmanagement
   # OR for MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement
   ```

### Step 3: Start MongoDB (if using local)
```bash
# Windows - if MongoDB is installed
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
# OR
brew services start mongodb-community
```

### Step 4: Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### Step 5: Verify Installation
Open your browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Expected Response:
```json
{
  "success": true,
  "status": "healthy",
  "uptime": 0.123,
  "timestamp": "2026-02-26T..."
}
```

---

## 🎯 Quick Test (2 minutes)

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}" \
  -c cookies.txt
```

### 3. Create a Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{\"title\":\"My First Task\",\"description\":\"Test task description\",\"status\":\"pending\"}"
```

### 4. Get All Tasks
```bash
curl http://localhost:5000/api/tasks -b cookies.txt
```

---

## 📱 Using Postman (Recommended)

### Setup Steps:
1. **Open Postman**
2. **Import Collection**:
   - Create new collection "Task Management API"
   - Set base URL variable: `{{baseUrl}}` = `http://localhost:5000/api`
3. **Enable Cookie Handling**:
   - Settings → General → "Automatically follow redirects" ✓
   - Settings → General → "Send cookies" ✓
4. **Create Requests** (see API_TESTING.md for all endpoints)

### Quick Requests:
1. POST `{{baseUrl}}/auth/register` - Body: `{"name":"John","email":"john@test.com","password":"test123"}`
2. POST `{{baseUrl}}/auth/login` - Body: `{"email":"john@test.com","password":"test123"}`
3. POST `{{baseUrl}}/tasks` - Body: `{"title":"Task 1","description":"Description","status":"pending"}`
4. GET `{{baseUrl}}/tasks`

---

## 📁 Project Structure at a Glance

```
backend/
│
├── 📁 config/              # Database configuration
│   └── db.js              # MongoDB connection setup
│
├── 📁 controllers/         # Business logic
│   ├── authController.js  # Auth: register, login, logout, profile
│   └── taskController.js  # Tasks: CRUD + pagination + search
│
├── 📁 middleware/          # Request processing
│   ├── authMiddleware.js  # JWT authentication & authorization
│   ├── errorMiddleware.js # Centralized error handling
│   └── validateMiddleware.js # Input validation (Joi schemas)
│
├── 📁 models/              # Data models
│   ├── User.js            # User schema (email, password, etc.)
│   └── Task.js            # Task schema (title, status, etc.)
│
├── 📁 routes/              # API endpoints
│   ├── authRoutes.js      # /api/auth/* routes
│   └── taskRoutes.js      # /api/tasks/* routes
│
├── 📁 utils/               # Helper functions
│   ├── generateToken.js   # JWT token creation & verification
│   ├── encrypt.js         # AES-256 encryption utilities
│   └── pagination.js      # Pagination helpers
│
├── 📄 server.js            # ⚡ Application entry point
├── 📄 package.json         # Dependencies & scripts
├── 📄 .env                 # 🔐 Environment variables (SECRET!)
├── 📄 .env.example         # Environment template
├── 📄 .gitignore           # Git ignore rules
│
├── 📘 README.md            # Complete API documentation
├── 📘 ARCHITECTURE.md      # Technical architecture guide
├── 📘 SECURITY.md          # Security guidelines & best practices
├── 📘 DEPLOYMENT.md        # Deployment instructions
├── 📘 API_TESTING.md       # API testing guide & examples
└── 📘 PROJECT_SUMMARY.md   # Project overview & highlights
```

---

## 🔑 Important Files

### Must Read:
1. **README.md** - Start here! Complete API documentation
2. **API_TESTING.md** - All API examples & testing guide
3. **.env** - Configure your environment variables

### For Deep Understanding:
4. **ARCHITECTURE.md** - Technical architecture details
5. **SECURITY.md** - Security features & best practices
6. **DEPLOYMENT.md** - Production deployment guide

---

## 🎓 Key Features

✅ **Authentication**
- User registration & login
- JWT tokens in HTTP-only cookies
- Password hashing with bcrypt
- Logout & session management

✅ **Task Management**
- Create, read, update, delete tasks
- Pagination (configurable page size)
- Filtering (by status, priority)
- Search (in title & description)
- Sorting (by date, priority, etc.)
- Bulk operations (delete, update status)
- Task statistics

✅ **Security**
- Rate limiting (100 req/15min)
- NoSQL injection prevention
- Input validation (Joi)
- CORS configuration
- Helmet security headers
- AES-256 encryption utility

✅ **Code Quality**
- Clean architecture (MVC)
- Error handling
- Async/await
- JSDoc comments
- Industry best practices

---

## 📊 Available Scripts

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start

# Install dependencies
npm install

# Check for vulnerabilities
npm audit
```

---

## 🌐 API Base URL

Development: `http://localhost:5000/api`
Production: `https://your-domain.com/api`

---

## 📞 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Check if MongoDB is running
- Verify MONGO_URI in `.env`
- For Atlas, check network access whitelist

### Issue: "Port 5000 already in use"
**Solution**:
```bash
# Change PORT in .env
PORT=3000
```

### Issue: "JWT token invalid"
**Solution**:
- Make sure JWT_SECRET in `.env` is set
- Clear cookies and login again

### Issue: "npm install fails"
**Solution**:
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

---

## 🚀 Next Steps

### For Development:
1. ✅ Install dependencies
2. ✅ Configure `.env`
3. ✅ Start MongoDB
4. ✅ Run `npm run dev`
5. ✅ Test with Postman/curl
6. 📖 Read API_TESTING.md for all endpoints

### For Production:
1. 📖 Read DEPLOYMENT.md
2. 🔐 Update secrets in `.env`
3. 🗄️ Set up MongoDB Atlas
4. 🚀 Deploy to platform of choice
5. 📊 Set up monitoring
6. 💾 Configure backups

### For Learning:
1. 📖 Study ARCHITECTURE.md
2. 🔍 Explore code structure
3. 🧪 Test all API endpoints
4. 🔐 Review SECURITY.md
5. 💡 Understand design patterns

---

## 💡 Pro Tips

1. **Use Postman Collections** - Easier than curl for testing
2. **Enable Auto-Save in .env** - Don't lose your config!
3. **Check Logs** - Server logs show helpful error messages
4. **Read Documentation** - Everything is documented in detail
5. **Use MongoDB Compass** - Visual tool to browse database

---

## 📚 Documentation Index

| File | Purpose | When to Read |
|------|---------|--------------|
| README.md | API docs & getting started | First! |
| API_TESTING.md | All endpoints with examples | Testing |
| ARCHITECTURE.md | Technical deep dive | Understanding code |
| SECURITY.md | Security features | Security review |
| DEPLOYMENT.md | Production deployment | Deploying |
| PROJECT_SUMMARY.md | Project overview | Quick reference |

---

## 🎉 You're All Set!

Your production-ready Task Management API is ready to use!

**Default Server**: http://localhost:5000
**Health Check**: http://localhost:5000/api/health
**API Base**: http://localhost:5000/api

**Need help?** 
- Check the documentation files
- Review code comments
- Test with examples in API_TESTING.md

---

**Happy Coding! 🚀**

---

*Built with Node.js, Express, MongoDB, and following industry best practices.*
