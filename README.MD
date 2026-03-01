# Cortex

Cortex is a modern, high-performance Event Management and Membership platform. It features a robust multi-tenant architecture allowing organizations to manage events, ticket sales, and memberships through a unified digital interface.

## 🚀 Live Links
* **Production Frontend:** [https://cortex-quirbyte.vercel.app](https://cortex-frontend-rho.vercel.app)
* **Backend API:** [https://cortex-8u47.onrender.com/api/v1](https://cortex-8u47.onrender.com/api/v1)

---

## 🛠 Tech Stack

### Frontend (Vercel)
* **React 19 & Vite:** Lightning-fast development and optimized production builds.
* **Tailwind CSS 4:** Modern styling with advanced utility-first design.
* **Framer Motion:** Smooth, high-quality UI animations.
* **TanStack Query:** Efficient server-state management and caching.
* **Axios:** Customized API client with interceptors for token and tenant management.

### Backend (Render)
* **Node.js & Express:** Scalable RESTful API architecture.
* **TypeScript:** Type-safe development across the entire backend.
* **MongoDB Atlas:** Managed NoSQL database for flexible data modeling.
* **Mongoose:** Object Data Modeling (ODM) for MongoDB.
* **JWT:** Secure authentication and authorization.

---

## 📂 Project Structure

```text
Cortex/
├── apps/
│   ├── frontend/             
│   │   ├── src/components/ui # Shadcn & Animated UI components
│   │   ├── src/hooks         # Reusable business logic
│   │   ├── src/api/apiClient # Centralized Axios configuration
│   │   └── vite.config.ts    # Build and alias configuration
│   └── backend/              
│       ├── Routes/           # Modular route handlers
│       ├── Models/           # MongoDB schemas
│       └── index.ts          # Server entry point & CORS config