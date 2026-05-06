# CRM Lead Management System

A complete, production-quality full-stack CRM Lead Management System built with modern web technologies.

## 🌟 Features

### Authentication
- JWT-based login system
- Protected routes (no access without login)
- Test user included (admin@example.com / password123)
- Middleware for protected routes

### Lead Management (CRUD)
- Create, Read, Update, Delete leads
- Full lead information: name, company, email, phone, source, assignee, status, deal value
- Lead timeline tracking (createdAt, updatedAt)
- Search and filtering capabilities
- Pagination support
- Quick status updates inline

### Lead Notes
- Multiple notes per lead
- Note timeline (latest first)
- Add notes from lead detail page
- Track who created each note and when

### Dashboard
- Total leads count
- New leads count
- Qualified leads count
- Won deals count
- Lost deals count
- Total deal value (all leads)
- Total won deal value (won leads only)
- Leads by source breakdown
- Leads by status breakdown

### Search & Filtering
- Filter by status (New, Contacted, Qualified, Proposal Sent, Won, Lost)
- Filter by lead source (Website, LinkedIn, Referral, Cold Email, Event)
- Filter by assigned salesperson
- Search by lead name, company name, email

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **HTTP Client**: Axios

## 📁 Project Structure

```
crm-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js     # Authentication logic
│   │   │   ├── leadController.js     # Lead CRUD operations
│   │   │   └── dashboardController.js # Dashboard statistics
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT verification
│   │   │   └── errorHandler.js       # Global error handling
│   │   ├── models/
│   │   │   ├── User.js               # User model
│   │   │   └── Lead.js               # Lead model
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Auth endpoints
│   │   │   ├── leadRoutes.js         # Lead endpoints
│   │   │   └── dashboardRoutes.js    # Dashboard endpoints
│   │   ├── utils/
│   │   │   └── validators.js         # Input validation functions
│   │   ├── app.js                    # Express app configuration
│   │   └── server.js                 # Server entry point
│   ├── scripts/
│   │   └── seed.js                   # Database seed script
│   ├── package.json
│   ├── .env                          # Environment variables
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   │   ├── ProtectedRoute.jsx # Protected route wrapper
│   │   │   │   └── PublicRoute.jsx   # Public route wrapper
│   │   │   └── ui/
│   │   │       └── index.jsx          # Reusable UI components
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Authentication context
│   │   ├── hooks/
│   │   │   └── useAuth.js            # Auth hook
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx         # Login page
│   │   │   ├── DashboardPage.jsx     # Dashboard page
│   │   │   ├── LeadsListPage.jsx     # Leads list page
│   │   │   └── LeadDetailPage.jsx    # Lead detail page
│   │   ├── services/
│   │   │   ├── api.js                # Axios instance
│   │   │   └── index.js              # API service methods
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env                          # Environment variables
│   └── .env.example
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or remote URI)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (copy from .env.example)
   ```bash
   cp .env.example .env
   ```
   
   Update the following in `.env`:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `PORT`: Server port (default: 5000)
   - `NODE_ENV`: Environment (development/production)

4. **Seed the database** (creates test user and sample data)
   ```bash
   npm run seed
   ```

5. **Start the server**
   - **Development** (with nodemon auto-reload):
     ```bash
     npm run dev
     ```
   - **Production**:
     ```bash
     npm start
     ```

The backend will run on `http://localhost:5000` by default.

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (copy from .env.example)
   ```bash
   cp .env.example .env
   ```
   
   Update the following:
   - `VITE_API_URL`: Backend API URL (default: `http://localhost:5000/api`)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

The frontend will run on `http://localhost:5173` by default (or the port Vite assigns).

## 📝 Default Test Credentials

```
Email: admin@example.com
Password: password123
```

## 🔌 API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "username": "admin",
    "role": "admin"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "username": "admin",
    "role": "admin"
  }
}
```

### Leads

#### Get All Leads
```http
GET /api/leads?page=1&limit=10&status=New&leadSource=Website&assignedSalesperson=John Doe&search=tech&sortBy=createdAt&sortOrder=desc
Authorization: Bearer <token>

Response:
{
  "leads": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "leadName": "John Smith",
      "companyName": "Tech Corp",
      "email": "john@techcorp.com",
      "phone": "+1-555-0101",
      "leadSource": "Website",
      "assignedSalesperson": "John Doe",
      "status": "New",
      "dealValue": 50000,
      "notes": [],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### Get Single Lead
```http
GET /api/leads/:id
Authorization: Bearer <token>

Response:
{
  "_id": "507f1f77bcf86cd799439011",
  "leadName": "John Smith",
  "companyName": "Tech Corp",
  "email": "john@techcorp.com",
  "phone": "+1-555-0101",
  "leadSource": "Website",
  "assignedSalesperson": "John Doe",
  "status": "New",
  "dealValue": 50000,
  "notes": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "content": "Follow up next week",
      "createdBy": "Current User",
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Create Lead
```http
POST /api/leads
Authorization: Bearer <token>
Content-Type: application/json

{
  "leadName": "John Smith",
  "companyName": "Tech Corp",
  "email": "john@techcorp.com",
  "phone": "+1-555-0101",
  "leadSource": "Website",
  "assignedSalesperson": "John Doe",
  "status": "New",
  "dealValue": 50000
}

Response:
{
  "message": "Lead created successfully",
  "lead": {
    "_id": "507f1f77bcf86cd799439011",
    "leadName": "John Smith",
    ...
  }
}
```

#### Update Lead
```http
PUT /api/leads/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Contacted",
  "dealValue": 75000
}

Response:
{
  "message": "Lead updated successfully",
  "lead": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "Contacted",
    "dealValue": 75000,
    ...
  }
}
```

#### Delete Lead
```http
DELETE /api/leads/:id
Authorization: Bearer <token>

Response:
{
  "message": "Lead deleted successfully"
}
```

### Notes

#### Add Note to Lead
```http
POST /api/leads/:id/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Follow up next week",
  "createdBy": "Current User"
}

Response:
{
  "message": "Note added successfully",
  "lead": {
    "_id": "507f1f77bcf86cd799439011",
    "notes": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "content": "Follow up next week",
        "createdBy": "Current User",
        "createdAt": "2024-01-15T11:00:00Z"
      }
    ]
  }
}
```

### Dashboard

#### Get Dashboard Statistics
```http
GET /api/dashboard
Authorization: Bearer <token>

Response:
{
  "totalLeads": 25,
  "newLeads": 5,
  "qualifiedLeads": 8,
  "wonLeads": 10,
  "lostLeads": 2,
  "totalDealValue": 1250000,
  "totalWonValue": 750000,
  "leadsBySource": [
    {
      "_id": "Website",
      "count": 10
    },
    {
      "_id": "LinkedIn",
      "count": 8
    }
  ],
  "leadsByStatus": [
    {
      "_id": "New",
      "count": 5
    },
    {
      "_id": "Contacted",
      "count": 7
    }
  ]
}
```

## 🧪 Sample API Requests (cURL)

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### Get All Leads
```bash
curl -X GET http://localhost:5000/api/leads \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Lead
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "leadName": "Jane Doe",
    "companyName": "Innovation Inc",
    "email": "jane@innovationinc.com",
    "phone": "+1-555-0102",
    "leadSource": "LinkedIn",
    "assignedSalesperson": "Sarah Johnson",
    "status": "New",
    "dealValue": 100000
  }'
```

### Update Lead Status
```bash
curl -X PUT http://localhost:5000/api/leads/LEAD_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Qualified"
  }'
```

### Add Note to Lead
```bash
curl -X POST http://localhost:5000/api/leads/LEAD_ID/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Follow up tomorrow",
    "createdBy": "John Doe"
  }'
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🗄️ MongoDB Schema

### User Schema
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'salesperson']),
  createdAt: Date,
  updatedAt: Date
}
```

### Lead Schema
```javascript
{
  leadName: String (required),
  companyName: String (required),
  email: String (required, unique),
  phone: String (required),
  leadSource: String (enum: ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event']),
  assignedSalesperson: String (required),
  status: String (enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']),
  dealValue: Number (required, min: 0),
  notes: [
    {
      content: String (required),
      createdBy: String (required),
      createdAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Protected API routes requiring valid tokens
- Input validation on all endpoints
- Error handling middleware
- CORS support

## 🎯 Available Status Values

- **New**: Freshly created lead
- **Contacted**: Initial contact has been made
- **Qualified**: Lead has been qualified as a potential customer
- **Proposal Sent**: A proposal has been sent to the lead
- **Won**: Deal has been closed successfully
- **Lost**: Lead is no longer being pursued

## 📊 Lead Source Options

- **Website**: Lead from company website
- **LinkedIn**: Lead from LinkedIn platform
- **Referral**: Lead from customer referral
- **Cold Email**: Lead from cold email campaign
- **Event**: Lead from conference or event

## 🚨 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` is correct
- Verify network connectivity if using remote MongoDB

### Port Already in Use
- Change `PORT` in backend `.env`
- Change the port Vite uses in frontend (edit vite.config.js)

### CORS Errors
- Ensure frontend `VITE_API_URL` matches backend URL
- Check backend CORS configuration in `server.js`

### Authentication Fails
- Verify test user was created: Run `npm run seed` in backend
- Check JWT_SECRET is set in backend `.env`
- Ensure token is included in Authorization header: `Bearer <token>`

## 📚 Validation Rules

### Email
- Must be valid email format
- Must be unique in database

### Phone
- Must contain at least 7 digits
- Allows digits, spaces, hyphens, plus sign, and parentheses

### Deal Value
- Must be a non-negative number

### Lead Source
- Must be one of: Website, LinkedIn, Referral, Cold Email, Event

### Status
- Must be one of: New, Contacted, Qualified, Proposal Sent, Won, Lost

## 🔄 Data Flow

1. User logs in with credentials
2. Backend validates credentials and returns JWT token
3. Frontend stores token in localStorage
4. Frontend includes token in Authorization header for all API requests
5. Backend middleware verifies token on protected routes
6. User can perform CRUD operations on leads
7. Dashboard aggregates lead statistics from database
8. Notes are added to leads and displayed in chronological order

## 📦 Production Deployment

### Backend
1. Update `.env` with production values
2. Use a process manager like PM2: `npm install -g pm2`
3. Start with PM2: `pm2 start src/server.js`
4. Deploy to services like Heroku, Railway, or DigitalOcean

### Frontend
1. Build for production: `npm run build`
2. The `dist` folder contains static files
3. Deploy to services like Vercel, Netlify, or AWS S3

## 🤝 Contributing

Feel free to modify and extend this project for your needs.

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using React, Node.js, and MongoDB**
