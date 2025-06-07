# Wellness2k25
![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-cc6699?style=for-the-badge&logo=sass&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)


A full-stack wellness appointment booking platform built with **Next.js** (frontend) and **Express.js** (backend). Users can browse services, book sessions, and manage their wellness appointments. Admins can manage availability, services, and bookings.

---

## Stack

### Frontend
- [Next.js 14+ (App Router)](https://nextjs.org/docs)
- React (via Next.js)
- SCSS Modules or Tailwind CSS (optional)
- Context API or Zustand for state management

### Backend
- [Express.js](https://expressjs.com/)
- Node.js
- PostgreSQL (via Prisma or `pg`)
- RESTful API (JSON)

### Auth & Security
- JWT Authentication or [NextAuth.js](https://next-auth.js.org/) *(optional depending on SSR needs)*
- Bcrypt (password hashing)
- Helmet & CORS middleware for secure headers

---

## 📁 Project Structure
```
wellness-app/
│
├── client/ # Next.js frontend
│ ├── app/ # App Router pages
│ ├── components/ # Reusable UI components
│ ├── context/ # Global state
│ ├── styles/ # SCSS modules or Tailwind
│ ├── services/ # Frontend API functions
│ └── ...
│
├── server/ # Express backend
│ ├── routes/ # API route handlers
│ ├── controllers/ # Business logic
│ ├── models/ # Database models
│ ├── middleware/ # Auth, error handling
│ └── ...
│
├── .env # Environment variables
├── package.json # Root config (or use workspaces)
└── README.md
```

---

## MVP Features

### Users
- Browse wellness services
- Sign up / Login
- Book available time slots
- View upcoming and past appointments

### Admins
- Add, edit, and delete services
- Manage availability calendar
- View user bookings
- Admin dashboard (protected)

---

## Setup

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```


## API Routes

### Auth
| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| POST   | `/api/auth/register` | Register a new user      |
| POST   | `/api/auth/login`    | Log in and receive token |

### Services
| Method | Endpoint         | Description                |
|--------|------------------|----------------------------|
| GET    | `/api/services`  | Get all wellness services  |
| POST   | `/api/services`  | Create new service (admin) |
| PUT    | `/api/services/:id` | Update service (admin) |
| DELETE | `/api/services/:id` | Delete service (admin) |

### Bookings
| Method | Endpoint            | Description                     |
|--------|---------------------|---------------------------------|
| GET    | `/api/bookings`     | Get user’s bookings             |
| POST   | `/api/bookings`     | Book a new appointment          |
| PUT    | `/api/bookings/:id` | Update booking (user/admin)     |
| DELETE | `/api/bookings/:id` | Cancel booking (user/admin)     |

### Users
| Method | Endpoint      | Description              |
|--------|---------------|--------------------------|
| GET    | `/api/users`  | Get all users (admin)    |
| GET    | `/api/users/:id` | Get specific user     |

