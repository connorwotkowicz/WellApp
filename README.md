# Wellness2k25
![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-cc6699?style=for-the-badge&logo=sass&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?style=for-the-badge&logo=vercel&logoColor=white)
![ngrok](https://img.shields.io/badge/ngrok-1F1E37?style=for-the-badge&logo=ngrok&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)



> **Note**: This test project is a work in progress. Though functional locally, the deployed application is still undergoing testing ([View current build](https://wellness2k25.vercel.app/)) and features are still being implemented and tested. Some functionality is still being refined and added, and the README will be updated accordingly.

---

## Tech Stack

> Grey items are planned or not yet completed.

### Frontend
- Next.js 14 (App Router)
- React
- TypeScript
- Javascript
- SCSS Modules
- Context API for state management
- Vite (early development)
- React Router (prior to migration)

### Backend
- Node.js
- Express.js
- RESTful API
- PostgreSQL (hosted on Supabase)
- pg + dotenv

### Authentication & Security
- JWT authentication
- Google OAuth
- Bcrypt for password hashing
- Helmet
- CORS
### Payments
- > Stripe Checkout and Stripe Elements
- > Stripe Node SDK
- > Guest checkout flow

### Dev Tools & Deployment
- ngrok for local testing
- Vercel (frontend)
- AWS EC2 (backend)
- > Render if needed
- Supabase (database)
- Axios

### Testing
- > Jest
- > React Testing Library
- > Supertest


---

## Basic Features

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



## Author

- Connor Wotkowicz
- - [GitHub](https://github.com/connorwotkowicz)
- - [LinkedIn](https://www.linkedin.com/in/wotkowicz)

