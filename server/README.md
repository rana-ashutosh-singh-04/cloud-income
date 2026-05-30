# Cloud Income

Cloud Income is a comprehensive, modern payment and financial management platform designed as "India's Most Trusted Payments App." It provides users with a seamless, highly aesthetic interface to manage daily financial needs, offering a premium user experience powered by 3D visuals and dynamic animations.

## 🚀 Key Features

*   **Comprehensive Payment Solutions:** Instantly send money, pay utility bills, and manage mobile/DTH recharges.
*   **Financial Dashboard:** Track stock market trends, manage credit cards, and oversee investments (Mutual Funds, Gold, Insurance).
*   **Premium User Interface:** A warm, minimalist "Sahara" design theme with smooth Framer Motion animations and responsive layouts.
*   **Immersive 3D Elements:** High-performance WebGL 3D models (Bitcoin, Credit Cards) integrated directly into the Hero section using React Three Fiber.
*   **Real-time Capabilities:** Instant notifications and live updates powered by WebSockets.
*   **Robust Security:** Bank-grade encryption, secure user authentication (JWT), and privacy-first architecture.

## 🛠️ Tech Stack

### Frontend (Client)
*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **3D Graphics:** `@react-three/fiber`, `@react-three/drei`
*   **Routing:** React Router DOM
*   **Icons:** Lucide React

### Backend (Server)
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (via Mongoose)
*   **Authentication:** JSON Web Tokens (JWT) & bcrypt
*   **Real-time Engine:** Socket.io

## 📂 Project Structure

*   `/client`: Contains the Vite-based React frontend application.
*   `/server`: Contains the Node.js/Express backend API, WebSocket logic, and database schemas.

## 🏃‍♂️ Getting Started

### Prerequisites
*   Node.js installed on your machine
*   MongoDB instance (local or Atlas)

### Running the Server
1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Setup your environment variables (e.g., MongoDB URI, JWT Secret).
4. Start the development server: `npm run dev`

### Running the Client
1. Navigate to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
