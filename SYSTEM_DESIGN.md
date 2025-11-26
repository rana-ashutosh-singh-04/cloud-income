# PhonePay Clone - System Design Documentation

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication Flow](#authentication-flow)
7. [Transaction Flow](#transaction-flow)
8. [Frontend Architecture](#frontend-architecture)
9. [Features](#features)
10. [File Structure](#file-structure)
11. [Setup Instructions](#setup-instructions)
12. [Future Enhancements](#future-enhancements)

---

## 🎯 System Overview

This is a **PhonePe/UPI payment application clone** built with a **React frontend** and **Node.js/Express backend**. The system allows users to:
- Register and authenticate with phone number and PIN
- Send money to other users via VPA (Virtual Payment Address)
- View transaction history
- Receive money via QR code
- Track wallet balance, rewards, and gold points

---

## 🏗️ Architecture

### Architecture Pattern
The application follows a **Client-Server Architecture** with clear separation of concerns:

```
┌─────────────────┐         HTTP/REST API         ┌─────────────────┐
│                 │ ────────────────────────────> │                 │
│  React Client   │                               │  Express Server │
│  (Frontend)     │ <──────────────────────────── │  (Backend)      │
│                 │         JSON Responses        │                 │
└─────────────────┘                               └─────────────────┘
                                                           │
                                                           │ MongoDB
                                                           │ Queries
                                                           ▼
                                                  ┌─────────────────┐
                                                  │   MongoDB       │
                                                  │   Database      │
                                                  └─────────────────┘
```

### Key Components:
1. **Frontend (Client)**: React SPA with Zustand state management
2. **Backend (Server)**: Express.js REST API
3. **Database**: MongoDB with Mongoose ODM
4. **Authentication**: JWT (JSON Web Tokens)

---

## 💻 Technology Stack

### Frontend
- **React 19.1.1** - UI library
- **React Router DOM 7.9.5** - Client-side routing
- **Zustand 5.0.8** - State management
- **Axios 1.13.2** - HTTP client
- **Tailwind CSS 4.1.17** - Styling framework
- **Vite 7.1.7** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express 5.1.0** - Web framework
- **Mongoose 8.19.3** - MongoDB ODM
- **JSON Web Token 9.0.2** - Authentication
- **bcrypt 6.0.0** - Password hashing
- **UUID 13.0.0** - Unique transaction references
- **CORS 2.8.5** - Cross-origin resource sharing
- **Morgan 1.10.1** - HTTP request logger

### Database
- **MongoDB** - NoSQL database

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  phone: String (required, unique),
  vpa: String (required, unique),        // Virtual Payment Address
  pin: String (required, hashed),        // Hashed using bcrypt
  balance: Number (default: 1000),       // Wallet balance
  rewards: Number (default: 0),          // Rewards points
  gold: Number (default: 0),             // Gold points (in gm)
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Transaction Model
```javascript
{
  sender: ObjectId (ref: User, required),
  receiver: ObjectId (ref: User, required),
  amount: Number (required),
  type: String (enum: ['DEBIT', 'CREDIT'], required),
  counterpartyName: String (required),   // Name of the other party
  note: String (default: ''),
  reference: String (unique),            // UUID for transaction tracking
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Transaction Flow Design
- Each money transfer creates **TWO transaction records**:
  1. **DEBIT transaction** for the sender (money going out)
  2. **CREDIT transaction** for the receiver (money coming in)
- Both transactions share the same `reference` (UUID) for tracking
- This design allows easy querying of transaction history from both perspectives

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/signup`
- **Purpose**: Register a new user
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "phone": "1234567890",
    "vpa": "john@bank",
    "pin": "1234"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "phone": "1234567890",
      "vpa": "john@bank",
      "balance": 1000,
      "rewards": 0,
      "gold": 0
    }
  }
  ```

#### POST `/api/auth/login`
- **Purpose**: Authenticate existing user
- **Request Body**:
  ```json
  {
    "phone": "1234567890",
    "pin": "1234"
  }
  ```
- **Response**: Same as signup

#### GET `/api/auth/me`
- **Purpose**: Get current user profile
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User object (same as signup response)

### Transaction Routes (`/api/txn`)

#### POST `/api/txn/send`
- **Purpose**: Send money to another user
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "vpa": "receiver@bank",
    "amount": 100,
    "note": "Payment for services"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Money sent successfully",
    "transaction": {
      "id": "transaction_id",
      "amount": 100,
      "receiver": "Receiver Name",
      "reference": "uuid-reference"
    }
  }
  ```
- **Validation**:
  - Amount must be > 0
  - Sender must have sufficient balance
  - Receiver must exist
  - Cannot send to yourself

#### GET `/api/txn/recent`
- **Purpose**: Get recent transactions for current user
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "transactions": [
      {
        "id": "txn_id",
        "amount": 100,
        "type": "DEBIT" | "CREDIT",
        "counterpartyName": "Other User Name",
        "note": "Payment note",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```
- **Notes**:
  - Returns last 20 transactions
  - Sorted by creation date (newest first)
  - Type is determined based on whether user is sender or receiver

#### POST `/api/txn/qr-pay`
- **Purpose**: Pay via QR code
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "qrData": "receiver@bank",
    "amount": 100,
    "note": "QR payment"
  }
  ```
- **Response**: Same as send endpoint
- **Note**: Currently, QR data is treated as VPA. In production, QR codes would contain structured payment data.

---

## 🔐 Authentication Flow

### Authentication Mechanism
- **JWT (JSON Web Token)** based authentication
- Token expires in **7 days**
- Token is sent in `Authorization` header: `Bearer <token>`

### Flow Diagram
```
1. User Registration/Login
   └─> Server validates credentials
       └─> Server generates JWT token
           └─> Token stored in localStorage (frontend)
               └─> Token added to API requests via Axios interceptor

2. Protected Route Access
   └─> Frontend checks for token in localStorage
       └─> If token exists: Add to request header
           └─> Backend middleware validates token
               └─> If valid: Attach user to request object
               └─> If invalid: Return 401 Unauthorized

3. Logout
   └─> Remove token from localStorage
       └─> Clear token from Axios headers
           └─> Redirect to login page
```

### Authentication Middleware
Located in `server/src/middleware/auth.js`:
- Extracts token from `Authorization` header
- Verifies token using JWT secret
- Fetches user from database
- Attaches user to `req.user` for route handlers

### PIN Security
- PINs are **hashed using bcrypt** (10 salt rounds)
- Original PIN is never stored in database
- PIN comparison is done using `bcrypt.compare()`

---

## 💸 Transaction Flow

### Send Money Flow
```
1. User enters receiver VPA, amount, and optional note
   └─> Frontend validates input (amount > 0)
       └─> POST /api/txn/send

2. Backend Processing:
   a. Validate amount > 0
   b. Check sender balance >= amount
   c. Find receiver by VPA
   d. Validate receiver exists and is not sender
   e. Generate unique reference (UUID)
   f. Create DEBIT transaction (sender)
   g. Create CREDIT transaction (receiver)
   h. Update sender balance: balance -= amount
   i. Update receiver balance: balance += amount
   j. Save all changes (transaction + balance updates)
   └─> Return success response

3. Frontend receives response
   └─> Display success message
       └─> Optionally refresh transaction history
```

### Transaction Atomicity
- All database operations (transaction creation + balance updates) are executed using `Promise.all()`
- In a production environment, this should use **MongoDB transactions** to ensure atomicity
- Current implementation may have race conditions in high-concurrency scenarios

### Balance Management
- Balance is stored directly on User model
- Updated synchronously during transaction
- Default starting balance: ₹1000

---

## 🎨 Frontend Architecture

### State Management
- **Zustand** store for authentication state (`useAuth` hook)
- Store manages:
  - `user`: Current user object
  - `token`: JWT token
  - `loading`: Loading state
  - Methods: `login()`, `signup()`, `logout()`, `initFromStorage()`

### Routing
- **React Router DOM** for client-side routing
- Routes:
  - `/` - Dashboard (protected)
  - `/send` - Send Money (protected)
  - `/bills` - Pay Bills (protected)
  - `/login` - Login (public)
  - `/signup` - Signup (public)
- Route protection handled in `App.jsx`:
  - If user is authenticated: Show protected routes, redirect others to `/`
  - If user is not authenticated: Show public routes, redirect others to `/login`

### API Integration
- **Axios** instance configured in `lib/api.js`
- Base URL: `http://localhost:4000/api` (configurable via env variable)
- `setAuth()` function adds/removes Authorization header
- All API calls use this centralized instance

### Component Structure
```
App.jsx (Root)
├── Routes
    ├── Dashboard
    │   ├── Navbar
    │   ├── MoneyTile (Balance, Rewards, Gold)
    │   ├── Card (Quick Actions)
    │   ├── TransactionItem (Transaction list)
    │   └── QRModal
    ├── SendMoney
    │   ├── Navbar
    │   └── Card (Send form)
    ├── PayBills
    │   ├── Navbar
    │   └── Card (Bills form)
    ├── Login
    │   ├── Navbar
    │   └── Card (Login form)
    └── Signup
        ├── Navbar
        └── Card (Signup form)
```

### Styling
- **Tailwind CSS** for utility-first styling
- Responsive design with mobile-first approach
- Custom color scheme using CSS variables (primary, soft, ink)

---

## ✨ Features

### Implemented Features
1. ✅ User Registration and Login
2. ✅ JWT-based Authentication
3. ✅ Send Money via VPA
4. ✅ Transaction History
5. ✅ Wallet Balance Display
6. ✅ Rewards and Gold Points Tracking
7. ✅ QR Code Generation (UI only)
8. ✅ QR Payment (backend endpoint)
9. ✅ Protected Routes
10. ✅ Error Handling
11. ✅ Responsive UI

### Partially Implemented
- ⚠️ QR Code Scanning (UI exists, needs QR library integration)
- ⚠️ Pay Bills (page exists, needs backend integration)
- ⚠️ Recharge (route exists, needs implementation)

---

## 📁 File Structure

```
phone pay/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── card.jsx
│   │   │   ├── MoneyTitle.jsx
│   │   │   ├── Navabar.jsx
│   │   │   ├── QRMOdal.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── TransactionItem.jsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── useAuth.js           # Zustand auth store
│   │   ├── lib/                     # Utilities
│   │   │   └── api.js               # Axios instance
│   │   ├── pages/                   # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── aignup.jsx
│   │   │   ├── sendMoney.jsx
│   │   │   └── payBills.jsx
│   │   ├── App.jsx                  # Root component with routing
│   │   ├── router.jsx               # Route definitions
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Transaction.js       # Transaction schema
│   │   ├── routes/
│   │   │   ├── auth.js              # Auth endpoints
│   │   │   └── transactions.js      # Transaction endpoints
│   │   ├── utils/                   # Utility functions (empty)
│   │   └── app.js                   # Express app setup
│   ├── package.json
│   └── .env                         # Environment variables (not in repo)
│
└── SYSTEM_DESIGN.md                 # This file
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file**:
   ```env
   MONGO_URI=mongodb://localhost:27017/phonepay
   JWT_SECRET=your_secret_key_here
   PORT=4000
   ```

4. **Start MongoDB** (if using local instance):
   ```bash
   mongod
   ```

5. **Start the server**:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:4000`

### Frontend Setup

1. **Navigate to client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file** (optional):
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173` (default Vite port)

### Testing the Application

1. **Register a new user**:
   - Navigate to `/signup`
   - Enter name, phone, VPA, and PIN
   - Submit form

2. **Login**:
   - Navigate to `/login`
   - Enter phone and PIN
   - Submit form

3. **Send Money**:
   - Navigate to `/send`
   - Enter receiver VPA, amount, and note
   - Submit form

4. **View Transactions**:
   - Dashboard shows recent transactions
   - Balance, rewards, and gold are displayed

---

## 🔮 Future Enhancements

### Security Improvements
- [ ] Implement rate limiting for API endpoints
- [ ] Add request validation using libraries like `joi` or `express-validator`
- [ ] Implement MongoDB transactions for atomic operations
- [ ] Add PIN change functionality
- [ ] Implement refresh tokens for better security
- [ ] Add CORS configuration for production
- [ ] Implement input sanitization to prevent XSS attacks

### Features
- [ ] Implement real QR code generation and scanning
- [ ] Add bill payment integration
- [ ] Add recharge functionality (mobile, DTH, etc.)
- [ ] Implement transaction filters and search
- [ ] Add transaction export (PDF/CSV)
- [ ] Implement notifications system
- [ ] Add transaction categories and tags
- [ ] Implement recurring payments
- [ ] Add money request feature
- [ ] Implement bank account linking
- [ ] Add transaction limits and daily limits

### Database Improvements
- [ ] Add database indexes for frequently queried fields
- [ ] Implement database backup strategy
- [ ] Add transaction archiving for old transactions
- [ ] Implement database migrations

### UI/UX Improvements
- [ ] Add loading skeletons
- [ ] Implement proper error boundaries
- [ ] Add toast notifications for success/error
- [ ] Improve mobile responsiveness
- [ ] Add dark mode support
- [ ] Implement offline support (PWA)
- [ ] Add animations and transitions

### Testing
- [ ] Write unit tests for backend routes
- [ ] Write integration tests for API endpoints
- [ ] Write unit tests for React components
- [ ] Add end-to-end tests
- [ ] Implement test coverage reporting

### DevOps
- [ ] Set up CI/CD pipeline
- [ ] Add Docker containerization
- [ ] Implement environment-specific configurations
- [ ] Add logging and monitoring
- [ ] Set up error tracking (e.g., Sentry)

### Performance
- [ ] Implement API response caching
- [ ] Add database query optimization
- [ ] Implement pagination for transaction history
- [ ] Add lazy loading for components
- [ ] Optimize bundle size

---

## 📝 Notes

### Current Limitations
1. **No Atomic Transactions**: Balance updates and transaction creation are not wrapped in MongoDB transactions, which could lead to inconsistencies in high-concurrency scenarios.

2. **QR Code Implementation**: QR code generation is currently a placeholder. Need to integrate a QR library like `qrcode` or `react-qr-code`.

3. **Error Handling**: Basic error handling is implemented, but could be improved with better error messages and logging.

4. **Validation**: Client-side validation exists, but server-side validation is minimal. Should add comprehensive validation using libraries like `joi` or `express-validator`.

5. **Security**: JWT secret is hardcoded as fallback. Should always use environment variables in production.

6. **Testing**: No tests are currently written. Should add comprehensive test coverage.

### Design Decisions
1. **Dual Transaction Records**: Each money transfer creates two transaction records (DEBIT and CREDIT) to simplify querying transaction history from both user perspectives.

2. **Balance on User Model**: Balance is stored directly on the User model rather than calculated from transactions. This improves performance but requires careful balance management.

3. **VPA as Identifier**: Uses VPA (Virtual Payment Address) instead of phone number for money transfers, similar to real UPI systems.

4. **Zustand for State Management**: Chose Zustand over Redux for simplicity and less boilerplate, suitable for this application's scale.

---

## 🤝 Contributing

This is a learning project. Feel free to:
- Add new features
- Improve existing code
- Fix bugs
- Enhance documentation
- Add tests

---

## 📄 License

This project is for educational purposes.

---

**Last Updated**: 2024
**Version**: 1.0.0

