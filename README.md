# Wellness2k25
![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-cc6699?style=for-the-badge&logo=sass&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

A **web-based wellness platform** where users can book 1:1 sessions with vetted practitioners. The focus is on developing streamlined Progressive Web App (PWA) experience.

> **Note**: This project is a **work in progress**. The application has not yet been deployed, and features are still being implemented and tested. Some functionality is still being refined and added, and the README will be updated accordingly.

---

## Tech Stack

### Frontend
- **Next.js 14+** (App Router)
- React - Next.js
- SCSS Modules 
- Context API for state management

### Backend
- **Express.js**
- Node.js
- PostgreSQL 
- RESTful API

### Authentication & Security
- JWT Authentication
- Bcrypt 
- Helmet & CORS middleware 

---

## Features

### Users:
- Browse wellness services
- Sign up / Log in
- Book available time slots
- View upcoming and past appointments
- Access account page

### Admins:
- Manage users (update, delete, role assignment)
- Add, edit, and delete services
- Manage bookings (update status, delete bookings)
- Admin dashboard for data viewing/export (protected)

---

## Work in Progress

This application is still under active development, and the following features are either in progress or upcoming:

1. **Admin dashboard**: Admins can manage users, services, and bookings. 
2. **Availability calendar**: Feature to manage availability will be added in the future.
3. **Stripe payment integration**: Ongoing debugging of Stripe integration for booking payments.
4. **UI/UX Tweaks**: Some final touch-ups will be made to solidify visual flow, but the overall design is polished and functional.
5. **Post-launch support**: Roadmap for support will be outlined once MVP is finalized.

---

## Basic Setup, currently *very* basic
>More information to add later

### Backend Setup
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


## General API Routes

### Auth

| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| POST   | `/api/auth/register` | Register a new user      |
| POST   | `/api/auth/login`    | Log in and receive token |

### Services

| Method | Endpoint             | Description                |
|--------|----------------------|----------------------------|
| GET    | `/api/services`      | Get all wellness services  |
| PUT    | `/api/services/:id`  | Update service (admin)     |
| DELETE | `/api/services/:id`  | Delete service (admin)     |

### Bookings

| Method | Endpoint             | Description                     |
|--------|----------------------|---------------------------------|
| GET    | `/api/bookings`       | Fetch user bookings             |
| POST   | `/api/bookings`       | Book a new appointment          |
| PUT    | `/api/bookings/:id/status` | Update booking status (user/admin) |
| DELETE | `/api/bookings/:id`   | Delete booking (admin only)     |

### Users

| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| GET    | `/api/users`          | Get all users (admin)    |
| GET    | `/api/users/:id`      | Get specific user        |
| PUT    | `/api/users/:id`      | Update user (admin only) |
| DELETE | `/api/users/:id`      | Delete user (admin only) |

### Providers

| Method | Endpoint               | Description                        |
|--------|------------------------|------------------------------------|
| GET    | `/api/providers`        | Get all providers                  |
| PUT    | `/api/providers/:id`    | Edit provider (admin only)         |
| DELETE | `/api/providers/:id`    | Delete provider (admin only)       |
