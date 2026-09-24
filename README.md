# KAYA SPA

Next.js site in this folder. NestJS API in `backend/`.

```bash
npm run dev
```

```bash
cd backend
npm run start:dev
```

The site is at http://localhost:3000. The API listens on port 4000.

Appointment requests are stored in memory until `DATABASE_URL` is set and the Prisma migration in `backend/prisma/migrations` is applied. Menu prices and review cards are marked as placeholders. Phone, email, and street address stay unpublished until the spa provides them.

The official logo is `public/brand/kaya-logo.jpg`.
