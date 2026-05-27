# InsureAdmin Pro – Dark Edition

A premium enterprise insurance management dashboard built with React 19 + Vite + Tailwind CSS.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

## Stack

- **React 18** + React Router v6
- **Vite** (blazing fast dev server)
- **Tailwind CSS** (utility-first styling)
- **Recharts** (interactive charts)
- **Axios** (API integration with JWT)
- **React Hot Toast** (notifications)
- **Lucide React** (icons)

## Features

### Dashboard
- KPI stat cards with count-up animation
- Policy Premium Analysis (bar chart)
- Application Request Statistics (donut chart)
- Latest Policies table with pagination
- Recent Activity feed

### Processing Module
- Quote management (full CRUD)
- Renewal tracking
- Workers Comp quotes
- VAVE HomeOwners quotes
- BRIT Flood quotes
- Satinwood Wind Buy Back
- Upload Master (drag-and-drop with progress)
- Lender/REO quotes
- Find Transaction search

### Reports
- Revenue vs Expenses area chart
- Top Agent Production bar chart
- Policy Mix donut chart
- Exportable analytics

### Admin Module
- Agents (CRUD)
- Agent States (licenses)
- Commission Rates
- Carriers (CRUD)
- Clients
- Users
- Roles & Permissions

## API Integration

Edit `src/api/axios.js` to point to your backend:

```js
const api = axios.create({
  baseURL: 'http://localhost:8080/api',  // ← change this
})
```

JWT token is read from `localStorage.getItem('authToken')` and auto-attached.

## Folder Structure

```
src/
├── api/          # Axios instance
├── components/   # Reusable UI components
├── context/      # App-wide state (sidebar, user)
├── layouts/      # MainLayout wrapper
├── pages/        # All route pages
│   ├── processing/
│   └── admin/
├── utils/        # Helpers + mock data
├── App.jsx       # Router
└── main.jsx      # Entry point
```

## Replacing Mock Data

Replace mock imports in each page file with real API calls. Example:

```js
// Before (mock)
import { mockAgents } from '../../utils/mockData'

// After (API)
import api from '../../api/axios'
const { data } = await api.get('/admin/agents')
```

## Theme Customization

Edit `tailwind.config.js` and `src/index.css` for colors, fonts, and animations.

---

Built with ❤️ – InsureAdmin Pro Dark Edition
