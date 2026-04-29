# Cloud Income - Client Frontend

Welcome to the **Cloud Income** frontend repository! This is a modern, highly aesthetic, and fully responsive React application built with Vite and Tailwind CSS. The platform embraces the "Sahara" design system—a warm, minimalist aesthetic leveraging deep terracotta, linen backgrounds, and rich dark brown typography.

## 🚀 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React, Heroicons
- **3D Rendering**: React Three Fiber & Drei (for high-end visual hero sections)
- **Data Visualization**: Recharts (for the Stock Market features)
- **API Communication**: Axios (configured in `src/lib/api.js`)

## 📁 Folder Structure

```text
client/
├── public/                 # Static assets (3D models, fonts, images)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx      # Global top navigation
│   │   ├── Footer.jsx      # Global footer
│   │   ├── Hero.jsx        # Landing page 3D hero section
│   │   ├── FadeIn.jsx      # Reusable Framer Motion wrapper
│   │   └── ...
│   ├── pages/              # Main route components
│   │   ├── home.jsx        # Landing page
│   │   ├── Dashboard.jsx   # Authenticated user dashboard
│   │   ├── StockMarket.jsx # Real-time stock trading & analytics
│   │   ├── Contact.jsx     # Community & Contact split-layout
│   │   ├── TrustAndSafety.jsx # Security compliance page
│   │   └── ...
│   ├── hooks/              # Custom React hooks (e.g., useAuth)
│   ├── lib/                # Third-party lib configurations (e.g., axios)
│   ├── App.jsx             # Main application router
│   ├── index.css           # Global Tailwind directives and Sahara tokens
│   └── main.jsx            # React entry point
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

## 🎨 Design System (Sahara Aesthetic)

The application strictly adheres to a cohesive, warm minimalist design language. 

**Core Design Tokens:**
- **Primary Accent**: `#c2652a` (Terracotta) - Used for primary buttons, highlights, and active states.
- **Background**: `#faf5ee` (Linen) - The primary soft background color replacing stark white.
- **Text Primary**: `#2a1f17` (Dark Brown) - Used for primary headings and strong copy.
- **Text Secondary**: `#605850` / `#4a3d33` - Used for body text and descriptions.
- **Surfaces**: `#ffffff` (Pure White) - Used primarily for floating cards or components layered above the linen background.

**Visual Traits:**
- Large, bold serif typography for headings.
- Ample negative space and padding.
- Glassmorphism in navigation (`backdrop-blur`).
- Ghost text backgrounds and abstract blur spheres (`blur-3xl`).

## 🛠️ Key Features

- **Responsive Design**: Entire application is mobile-first, ensuring high-end layouts (like split-screen contact pages) stack beautifully on smaller screens.
- **Interactive Stock Market**: Includes real-time line/area charting via Recharts, color-coded based on positive (green) or negative (red) growth.
- **EmailJS Integration**: The Contact page natively handles form submissions directly to EmailJS.
- **User Authentication**: Integrated `useAuth` contexts handling secured routes (Dashboard, Payments, Stocks).

## 💻 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run the development server**:
   ```bash
   npm run dev
   ```
3. **Build for production**:
   ```bash
   npm run build
   ```

## 🧹 Maintenance Notes

- **Cleanup (April 2026)**: The `client` folder has been thoroughly audited and cleaned. Old, unused visual dependencies (like `HeroBackgroundSlider`, `particlesBackground`, `OptimizedImage`, and legacy `card` components) have been safely removed to reduce bundle size and keep the source tree uncluttered.
