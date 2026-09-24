-- PostgreSQL schema for KAYA SPA. Apply with `npx prisma migrate deploy` when DATABASE_URL is set.

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'admin',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ServiceCategory" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL
);

CREATE TABLE "Service" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "overview" TEXT NOT NULL,
  "durationMinutes" INTEGER NOT NULL,
  "image" TEXT NOT NULL,
  "imageAlt" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL REFERENCES "ServiceCategory"("id")
);

CREATE TABLE "ServicePrice" (
  "id" TEXT PRIMARY KEY,
  "label" TEXT NOT NULL,
  "amountNpr" INTEGER NOT NULL,
  "serviceId" TEXT NOT NULL REFERENCES "Service"("id")
);

CREATE TABLE "Package" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "durationLabel" TEXT NOT NULL,
  "priceNpr" INTEGER NOT NULL,
  "compareAtNpr" INTEGER,
  "image" TEXT NOT NULL
);

CREATE TABLE "PackageItem" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "detail" TEXT NOT NULL,
  "packageId" TEXT NOT NULL REFERENCES "Package"("id")
);

CREATE TABLE "Appointment" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "preferredDate" TEXT NOT NULL,
  "preferredTime" TEXT NOT NULL,
  "guests" INTEGER NOT NULL,
  "notes" TEXT,
  "serviceId" TEXT REFERENCES "Service"("id"),
  "packageId" TEXT REFERENCES "Package"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Review" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "text" TEXT NOT NULL,
  "isPlaceholder" BOOLEAN NOT NULL DEFAULT true,
  "published" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "GalleryImage" (
  "id" TEXT PRIMARY KEY,
  "src" TEXT NOT NULL,
  "alt" TEXT NOT NULL,
  "category" TEXT NOT NULL
);

CREATE TABLE "ContactMessage" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "NewsletterSubscriber" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SiteSetting" (
  "key" TEXT PRIMARY KEY,
  "value" TEXT NOT NULL
);
