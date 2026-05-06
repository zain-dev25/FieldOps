# FieldOps - Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Database Design](#database-design)
6. [Authentication & Authorization](#authentication--authorization)
7. [API Design](#api-design)
8. [Security Considerations](#security-considerations)
9. [Development & Deployment](#development--deployment)
10. [Technical Decisions](#technical-decisions)

---

## System Overview

FieldOps is a comprehensive field service management platform enabling organizations to manage job assignments, track field technicians, and monitor client requests in real-time.

### Core Features
- **Multi-role Dashboard:** Admin, Technician, and Client views
- **Job Management:** Create, assign, track, and complete service jobs
- **User Management:** Role-based access control (RBAC)
- **Real-time Updates:** Status tracking and assignments
- **Analytics Dashboard:** KPI metrics and performance tracking

### Business Goals
- Streamline field service operations
- Reduce job assignment latency
- Improve technician utilization
- Enhance client communication
- Provide actionable insights via KPIs

---

## High-Level Architecture
┌─────────────────────────────────────────────────────────────────┐
│ CLIENT LAYER │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Web │ │ Mobile │ │ API │ │ 3rd │ │
│ │ Browser │ │ (PWA) │ │ Clients │ │ Party │ │
│ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ │
└───────┼─────────────┼─────────────┼─────────────┼──────────────┘
│ │ │ │
│ HTTPS / REST API │ │
▼ ▼ ▼ ▼
┌─────────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ React SPA (Vite Build Tool) │ │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │ │
│ │ │ Pages │ │ Components│ │ Hooks │ │ Context │ │ │
│ │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │ │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │ │
│ │ │ Services │ │ Utils │ │ Styles │ │ Assets │ │ │
│ │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────┘
│
HTTP / JSON APIs
│
┌───────────────────────────────▼─────────────────────────────────┐
│ APPLICATION LAYER │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Node.js + Express.js Backend │ │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │ │
│ │ │ Routes │ │Controllers│ │Middleware│ │ Services │ │ │
│ │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │ │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │ │
│ │ │ Auth │ │ JWT │ │ Valid │ │ Error │ │ │
│ │ │ │ │ │ │ ation │ │ Handling │ │ │
│ │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────┘
│
MongoDB Driver
│
┌───────────────────────────────▼─────────────────────────────────┐
│ DATA LAYER │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ MongoDB Atlas │ │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │ │
│ │ │ Users │ │ Jobs │ │ Clients │ │ Techs │ │ │
│ │ │Collection│ │Collection│ │Collection│ │Collection│ │ │
│ │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘


---

## Frontend Architecture

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.4 | UI component library |
| **Vite** | 8.0.1 | Build tool & dev server |
| **React Router DOM** | 7.15.0 | Client-side routing |
| **Tailwind CSS** | 4.2.2 | Utility-first styling |
| **Chart.js** | 4.5.1 | Data visualization |
| **Axios** | 1.16.0 | HTTP client |
| **Lucide React** | 1.14.0 | Icon library |
| **jwt-decode** | 4.0.0 | JWT token parsing |

### Folder Structure
frontend/
├── src/
│ ├── components/ # Reusable UI components
│ │ ├── Layout/
│ │ │ ├── Navbar.jsx
│ │ │ ├── Sidebar.jsx
│ │ │ └── Footer.jsx
│ │ ├── Common/
│ │ │ ├── KpiCard.jsx
│ │ │ ├── LoadingSpinner.jsx
│ │ │ └── ErrorBoundary.jsx
│ │ └── Forms/
│ │ ├── JobForm.jsx
│ │ └── UserForm.jsx
│ │
│ ├── pages/ # Route-level components
│ │ ├── auth/
│ │ │ ├── Login.jsx
│ │ │ └── Register.jsx
│ │ ├── admin/
│ │ │ ├── AdminDashboard.jsx
│ │ │ ├── ManageUsers.jsx
│ │ │ └── Reports.jsx
│ │ ├── technician/
│ │ │ ├── TechnicianDashboard.jsx
│ │ │ └── MyJobs.jsx
│ │ └── client/
│ │ ├── ClientDashboard.jsx
│ │ └── RequestJob.jsx
│ │
│ ├── hooks/ # Custom React hooks
│ │ ├── useAuth.js
│ │ ├── useJobs.js
│ │ ├── useUsers.js
│ │ └── useLocalStorage.js
│ │
│ ├── context/ # React Context providers
│ │ └── AuthContext.jsx
│ │
│ ├── services/ # API integration layer
│ │ ├── api.js # Axios instance
│ │ ├── authService.js
│ │ ├── jobService.js
│ │ └── userService.js
│ │
│ ├── utils/ # Helper functions
│ │ ├── constants.js
│ │ ├── validators.js
│ │ └── formatters.js
│ │
│ ├── styles/ # Global styles
│ │ └── global.css
│ │
│ ├── App.jsx # Main app component
│ └── main.jsx # Entry point
│
├── public/ # Static assets
├── index.html
├── package.json
├── vite.config.js
└── README.md

### State Management Strategy

| State Type | Solution | Use Case |
|------------|----------|----------|
| **Authentication** | React Context | User session, role, token |
| **Global UI** | React Context | Theme, notifications, modals |
| **Local UI** | useState/useReducer | Form data, component state |
| **Server State** | Custom hooks + Axios | Jobs, users, API data |

### Routing Architecture

```javascript
// Route protection hierarchy
<Router>
  <Routes>
    {/* Public routes */}
    <Route path="/login" element={<Login />} />
    
    {/* Protected routes wrapper */}
    <Route element={<ProtectedRoute />}>
      {/* Admin only */}
      <Route element={<RoleBasedRoute roles={['ADMIN']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
      </Route>
      
      {/* Technician only */}
      <Route element={<RoleBasedRoute roles={['TECHNICIAN']} />}>
        <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
      </Route>
      
      {/* Client only */}
      <Route element={<RoleBasedRoute roles={['CLIENT']} />}>
        <Route path="/client/dashboard" element={<ClientDashboard />} />
      </Route>
    </Route>
  </Routes>
</Router>


//    Backend


backend/
├── models/                  # Mongoose schemas
│   ├── User.js
│   ├── Job.js
│   └── Client.js
│
├── controllers/             # Business logic
│   ├── authController.js
│   ├── jobController.js
│   ├── userController.js
│   └── dashboardController.js
│
├── routes/                  # API endpoints
│   ├── authRoutes.js
│   ├── jobRoutes.js
│   ├── userRoutes.js
│   └── dashboardRoutes.js
│
├── middleware/              # Express middleware
│   ├── authMiddleware.js    # JWT verification
│   ├── roleMiddleware.js    # RBAC checks
│   ├── validationMiddleware.js
│   ├── errorMiddleware.js
│   └── rateLimiter.js
│
├── config/                  # Configuration files
│   ├── db.js               # Database connection
│   ├── jwt.js              # JWT config
│   └── constants.js
│
├── utils/                   # Helper functions
│   ├── generateToken.js
│   ├── sendEmail.js
│   └── logger.js
│
├── validators/              # Input validation
│   ├── authValidator.js
│   └── jobValidator.js
│
├── server.js               # Application entry point
├── package.json
└── .env

// Model (models/Job.js)
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'] },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});


User (ADMIN) ──┬──< Job (created/managed)
               │
User (CLIENT) ─┴──< Job (requests)
               
User (TECHNICIAN) ──< Job (assigned)

Relationships:
- One-to-Many: User to Jobs
- Many-to-One: Jobs to User (client)
- Many-to-One: Jobs to User (technician)


┌──────────┐                  ┌──────────┐                  ┌──────────┐
│  Client  │                  │ Backend  │                  │  Database│
└────┬─────┘                  └────┬─────┘                  └────┬─────┘
     │                             │                             │
     │  1. POST /api/auth/login    │                             │
     │  {email, password}          │                             │
     │────────────────────────────▶│                             │
     │                             │  2. Find user by email      │
     │                             │────────────────────────────▶│
     │                             │                             │
     │                             │  3. Compare password        │
     │                             │  (bcrypt.compare)           │
     │                             │                             │
     │  4. Return JWT token        │                             │
     │◀────────────────────────────│                             │
     │                             │                             │
     │  5. Store token in          │                             │
     │     localStorage            │                             │
     │                             │                             │
     │  6. Subsequent requests     │                             │
     │     with Authorization:     │                             │
     │     Bearer <token>          │                             │
     │────────────────────────────▶│                             │
     │                             │  7. Verify JWT              │
     │                             │  (jwt.verify)               │
     │                             │                             │
     │  8. Return protected data   │                             │
     │◀────────────────────────────│                             │
     │                             │                             │


Security Considerations
Implemented Security Measures
Authentication Security

JWT with 24-hour expiration

Bcrypt password hashing (10 salt rounds)

Token stored in localStorage (with XSS protection)

API Security

CORS configured for allowed origins

Rate limiting (100 requests per 15 minutes)

Input validation and sanitization

SQL injection prevention (using MongoDB sanitization)

Data Protection

Password never returned in API responses

Sensitive data masked in logs

HTTPS in production (enforced)