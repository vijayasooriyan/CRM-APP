# CRM System - Quick Start Guide

## ⚡ Getting Started in 5 Minutes

### Step 1: Start MongoDB
Make sure MongoDB is running on your machine or update the connection string in backend `.env`.

```bash
# If using local MongoDB
mongod

# Or verify your connection string in backend/.env
MONGODB_URI=mongodb://localhost:27017/crm-app
```

### Step 2: Backend Setup & Run

```bash
# Terminal 1: Backend
cd backend
npm install
npm run seed        # Creates test user: admin@example.com / password123
npm run dev        # Start development server on port 5000
```

### Step 3: Frontend Setup & Run

```bash
# Terminal 2: Frontend
cd frontend
npm install
npm run dev        # Start development server on port 5173
```

### Step 4: Access the Application

1. Open browser: http://localhost:5173
2. Login with:
   - **Email**: admin@example.com
   - **Password**: password123
3. Start using the CRM!

## 🎯 What You Can Do

### Dashboard
- View total leads, new leads, qualified leads
- See won/lost deal counts
- Check total deal value and won deal value
- View leads breakdown by source and status

### Leads Management
- **Create**: Add new leads with all details
- **Read**: View all leads with search and filters
- **Update**: Edit lead information and status
- **Delete**: Remove leads from system

### Lead Details
- View complete lead information
- Add and view notes (timeline format)
- Update any lead field
- Track creation and update timestamps

### Filtering & Search
- Filter by status (New, Contacted, Qualified, Proposal Sent, Won, Lost)
- Filter by source (Website, LinkedIn, Referral, Cold Email, Event)
- Filter by assigned salesperson
- Search by lead name, company, or email

## 🔑 Key Features

✅ JWT Authentication
✅ Full CRUD Lead Management
✅ Lead Notes with Timeline
✅ Dashboard with Statistics
✅ Search and Filtering
✅ Pagination
✅ Responsive UI with Tailwind CSS
✅ Error Handling
✅ Input Validation

## 📱 Main Pages

1. **Login Page**: Secure authentication
2. **Dashboard**: Overview of all metrics
3. **Leads List**: Table view of all leads with filters
4. **Lead Detail**: Full lead information with notes section

## 🆘 Need Help?

### Server Not Starting?
```bash
# Check if port is in use
# Change PORT in backend/.env

# Verify MongoDB connection
# Check MONGODB_URI in backend/.env
```

### Frontend Not Loading?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check if backend is running on correct port
# Verify VITE_API_URL in frontend/.env
```

### Login Not Working?
```bash
# Reseed the database
cd backend
npm run seed

# Check JWT_SECRET is set in backend/.env
```

## 🚀 Next Steps

1. Customize lead fields (edit Lead model in `backend/src/models/Lead.js`)
2. Add more user roles and permissions
3. Implement email notifications
4. Add export/import functionality
5. Create custom reports
6. Add activity history tracking

## 📞 Support

Check the main README.md for detailed API documentation and troubleshooting.
