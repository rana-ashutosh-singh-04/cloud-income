# Cloud Income - Complete System Design Documentation

This document describes the high-level architecture, database schemas, API structures, real-time events, and security mechanisms of **Cloud Income** (a digital wallet, simulated stock market, and peer-to-peer gig marketplace hybrid).

---

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schemas](#database-schemas)
5. [API Endpoints](#api-endpoints)
6. [Real-time Events (Socket.IO)](#real-time-events-socketio)
7. [Authentication & Authorization](#authentication--authorization)
8. [Security & Sanitization Mechanisms](#security--sanitization-mechanisms)
9. [Responsive 3D WebGL Canvas Rendering](#responsive-3d-webgl-canvas-rendering)
10. [Database Seeding & Seeding Configurations](#database-seeding--seeding-configurations)
11. [Setup & Execution Instructions](#setup--execution-instructions)

---

## 🎯 System Overview
Cloud Income is a unified fintech and freelance ecosystem designed for student developers and clients:
*   **Dual-Use Wallet:** Deposit simulated money via mock gateways, perform instant peer-to-peer (P2P) transfers via UPI/VPA, scan QR codes, and execute bank or UPI withdrawals.
*   **Secure Freelance Escrow:** Locks client funds in milestone-based contracts, releasing funds to freelancers upon approved project milestones.
*   **Stock Trading Engine:** Real-time stock portfolio tracker connected to a dynamic market database.
*   **Gamified Rewards:** Tracks loyalty points (rewards) and virtual gold weights.
*   **Super Admin Control:** Full management of user accounts, transaction logs, asset updates, stock listings, and role promotions.

---

## 🏗️ Architecture

The platform follows a decoupled **Client-Server Architecture** using REST APIs for standard CRUD actions, and Socket.IO WebSockets for real-time notifications:

```
┌────────────────────────────────────────────────────────┐
│                      React Client                      │
│                 (Zustand State Store)                  │
└────────────────────────────────────────────────────────┘
     ▲                           ▲                    ▲
     │ HTTP REST (Axios)         │ WebSockets         │ Render
     ▼                           ▼                    ▼
┌──────────────────┐    ┌──────────────────┐    ┌───────────┐
│  Express Server  │<-->│    Socket.IO     │    │ WebGL 3D  │
│     (REST API)   │    │  (WS Events Feed)│    │ (ThreeJS) │
└──────────────────┘    └──────────────────┘    └───────────┘
         ▲
         │ Mongoose ODM
         ▼
┌──────────────────┐
│  MongoDB Atlas   │
└──────────────────┘
```

### Key Architectural Guidelines
1.  **Atomic Balance Transactions:** Direct balance updates on the database are executed using atomic operations (`findOneAndUpdate` with `$inc` and conditional filters) to prevent race conditions or double-spending.
2.  **Dual Transaction Logs:** Peer-to-peer transfers create two separate transaction entries (one `DEBIT` log for the sender and one `CREDIT` log for the receiver) sharing a unique `reference` (UUIDv4) to simplify transaction stream queries for individual user views.

---

## 💻 Technology Stack

### Frontend (Client)
*   **React 19.1.1** - User Interface Core
*   **React Router DOM 7.9.5** - Page Routing
*   **Zustand 5.0.8** - Lightweight Client State Management
*   **Axios 1.13.2** - HTTP REST Client
*   **Socket.IO Client 4.8.3** - WebSocket Event Handlers
*   **Three.js, React Three Fiber & Drei** - 3D WebGL Graphics Engine
*   **Tailwind CSS 4.1.17** - CSS Layouts & Components Styling
*   **Framer Motion** - Micro-animations & Transitions
*   **Recharts 3.6.0** - SVG Charts & Visual Analytics

### Backend (Server)
*   **Node.js** - Runtime Environment
*   **Express 5.2.1** - Web Framework
*   **Socket.IO 4.8.3** - WebSocket Event Server
*   **Mongoose 8.19.3** - MongoDB ODM
*   **JSON Web Token 9.0.2** - Bearer Authorization Tokens
*   **Bcrypt 6.0.0** - Cryptographic PIN Hashing
*   **UUID 13.0.0** - Unique Reference Identifiers

---

## 🗄️ Database Schemas

### 1. User Schema (`User.js`)
Stores user profiles, access control, and financial balances:
```javascript
{
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  vpa: { type: String, required: true, unique: true }, // Virtual Payment Address
  pin: { type: String, required: true },               // Hashed UPI PIN
  balance: { type: Number, default: 1000 },            // Available cash
  rewards: { type: Number, default: 0 },               // Accrued loyalty credits
  gold: { type: Number, default: 0 },                  // Accrued virtual gold (gm)
  isAdmin: { type: Boolean, default: false },          // Super Admin flag
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Transaction Schema (`Transaction.js`)
Tracks cash flows, deposits, P2P transfers, and withdrawals:
```javascript
{
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['DEBIT', 'CREDIT'], required: true },
  counterpartyName: { type: String, required: true },
  note: { type: String, default: '' },
  reference: { type: String, required: true },        // UUID reference link
  createdAt: Date
}
```

### 3. GlobalStock Schema (`GlobalStock.js`)
Stores available trade stocks in the market:
```javascript
{
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  change: { type: Number, default: 0 },
  changePercent: { type: Number, default: 0 }
}
```

### 4. Stock Holding Schema (`Stock.js`)
Tracks stock portfolios held by users:
```javascript
{
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  companyName: { type: String, required: true },
  quantity: { type: Number, required: true },
  averagePrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true }
}
```

### 5. StockTransaction Schema (`StockTransaction.js`)
Audits users' stock trading activities:
```javascript
{
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  companyName: { type: String, required: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  reference: { type: String, required: true }
}
```

---

## 🔌 API Endpoints

### 1. Authentication Routes (`/api/auth`)
*   `POST /signup` - Register user. Checks for adminSecret to grant admin privilege.
*   `POST /login` - Login user using phone number and PIN. Returns JWT.
*   `GET /me` - Returns logged-in user profile [Protected].

### 2. Transaction Routes (`/api/txn`)
*   `POST /send` - Execute a P2P UPI transfer to another user. Requires valid PIN.
*   `GET /recent` - Get recent transactions for dashboard feed [Protected].
*   `POST /qr-pay` - Process transfer via scanned VPA QR code [Protected].
*   `POST /simulate-receive` - Sandbox scanner utility to trigger simulated incoming cash transfers.
*   `POST /razorpay-order` - Generate mock payment order inside the deposit app simulator.
*   `POST /razorpay-verify` - Verify and credit wallet balance following simulated deposit.
*   `POST /withdraw` - Process withdrawal back to UPI or bank account. Requires valid PIN.

### 3. Stock Routes (`/api/stocks`)
*   `GET /market` - Get list of stocks and prices [Protected].
*   `GET /history/:symbol` - Get mock historical price data for charts [Protected].
*   `GET /holdings` - Get current user holdings [Protected].
*   `POST /buy` - Buy shares. Deducts balance, updates holdings, logs stock transaction.
*   `POST /sell` - Sell shares. Credits balance, updates holdings, logs stock transaction.
*   `GET /transactions` - Get personal stock trading history logs.

### 4. Admin Routes (`/api/admin`)
*   `GET /users` - Lists all users.
*   `GET /users/:id` - Inspect detailed profile, stock holdings, and cash history logs.
*   `PUT /users/:id/balance` - Set wallet balance, gold quantity, or rewards points.
*   `DELETE /users/:id` - Deletes user and purges holdings/transactions database logs.
*   `GET /transactions` - Audit logs of all regular and stock transactions.
*   `POST /stocks` - Add new stock ticker listing to the market.
*   `PUT /stocks/:symbol` - Modify name/price and recalculate price change statistics.
*   `DELETE /stocks/:symbol` - Delete stock listing from the global market.
*   `POST /promote` - Promote user to Super Admin using phone number or VPA.

---

## 🔄 Real-time Events (Socket.IO)

WebSocket rooms are segmented per user (`user:${userId}`). Real-time notifications are pushed by the backend on transaction occurrences:

1.  **`transaction:new`**: Emitted to both sender and receiver containing transaction details and updated cash balances.
2.  **`balance:update`**: Emitted to synchronize client header/profile statistics with database wallet balance changes.
3.  **`payment:received`**: Emitted to receivers, containing the sender's name and amount, triggering success chimes and overlay notifications.

---

## 🔐 Authentication & Authorization

### Flow Diagram
```
1. Client POST `/login` / `/signup`
   └─> Server signs JWT token (expires in 7 days)
       └─> Client stores token in localStorage
           └─> Axios interceptor appends "Authorization: Bearer <token>" to requests.

2. Access Verification:
   Client requests endpoint -> auth middleware -> Decodes token -> Sets req.user.
   
3. Admin Permission Verification:
   Endpoint -> auth -> adminAuth middleware -> Rejects with 403 if req.user.isAdmin !== true.
```

---

## 🛡️ Security & Sanitization Mechanisms
*   **NoSQL Injection Sanitization:** Casts body fields (`name`, `phone`, `vpa`, `pin`, `symbol`) explicitly using `String()` functions before performing database queries (`findOne`, `findOneAndUpdate`, etc.) to prevent object-based query operators injection (e.g. `{"$gt": ""}`).
*   **Hashed Credential Standards:** PIN values are hashed using `bcrypt` (10 rounds) and verified using cryptographic comparisons on `/send` and `/withdraw` actions.

---

## 📐 Responsive 3D WebGL Canvas Rendering
The Hero section utilizes WebGL 3D models (Bitcoin and Credit Card) inside a `Canvas` with an `ErrorBoundary` wrapping fallback graphics:

*   **Responsive Breakpoints:**
    *   **Mobile (< 640px):** Camera FOV centered. Bitcoin model scale: `0.35`, position: `[-2.4, 4.0, -3.5]`. Credit card model scale: `0.55`, position: `[1.0, -2.8, -3.5]`.
    *   **Tablet (< 1024px):** Bitcoin model scale: `0.55`, position: `[-2.8, 3.5, -3]`. Credit card model scale: `0.8`, position: `[2.8, -1.2, -3]`.
    *   **Desktop (>= 1024px):** Bitcoin model scale: `0.75`, position: `[-4.5, 2.5, -3]`. Credit card model scale: `1.1`, position: `[4.5, -0.5, -3]`.
*   **Fallback Assets Layout:** Uses equivalent responsive coordinates with CSS overlays (`bitcoinLeft`, `bitcoinTop`, `cardRight`, `cardBottom`) to display 3D falls when WebGL context gets lost or is unsupported.

---

## 🌱 Database Seeding & Seeding Configurations
On first initialization, the database connection config script (`server/src/config/database.js`) checks the `GlobalStock` collection:
*   If empty, it seeds the collection with **10 default blue-chip market stocks** (RELIANCE, TCS, HDFCBANK, INFYS, ICICIBANK, BHARTIALRT, SBI, HINDUNILVR, ITC, L&T) set to initial mock listing prices.

---

## 🚀 Setup & Execution Instructions

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB Atlas connection URI

### Server Configuration (`server/.env`)
```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

### Client Configuration (`client/.env`)
```env
VITE_API_URL=http://localhost:4000/api
```

### How to Run
1.  **Start Server:** `cd server && npm install && npm run dev`
2.  **Start Client:** `cd client && npm install && npm run dev`
