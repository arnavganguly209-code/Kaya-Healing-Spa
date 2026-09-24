# KAYA SPA

Next.js site in this folder. NestJS API in `backend/`.

```bash
npm run dev
```

```bash
cd backend
npm run start:dev
```

Local site: http://localhost:3000. The API listens on port 4000.

Production is https://kaya.theglobalorbit.com. A push to `main` runs `.github/workflows/deploy-vps.yml`, which updates only `/var/www/kaya-healing-spa` on the Hostinger VPS and restarts the `kaya-healing-spa` PM2 process on port 3005. GitHub needs the secrets `VPS_HOST`, `VPS_USER`, and `VPS_SSH_KEY`.

Appointment requests are stored in memory until `DATABASE_URL` is set and the Prisma migration in `backend/prisma/migrations` is applied. Menu prices and review cards are marked as placeholders. Phone, email, and street address stay unpublished until the spa provides them.

The official logo is `public/brand/kaya-logo.jpg`.
