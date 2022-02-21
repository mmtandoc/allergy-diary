-- CreateEnum
CREATE TYPE "PollenType" AS ENUM ('GRASS', 'MOLD', 'RAGWEED', 'TREE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "mainMunicipalityId" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entries" (
    "userId" INTEGER NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "municipalityId" INTEGER,

    CONSTRAINT "entries_pkey" PRIMARY KEY ("userId","date")
);

-- CreateTable
CREATE TABLE "forecasts" (
    "municipalityId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "dateRetrieved" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forecasts_pkey" PRIMARY KEY ("municipalityId","date")
);

-- CreateTable
CREATE TABLE "pollen_levels" (
    "forecastMunicipalityId" INTEGER NOT NULL,
    "forecastDate" DATE NOT NULL,
    "type" "PollenType" NOT NULL,
    "value" INTEGER NOT NULL,
    "categoryValue" INTEGER NOT NULL,

    CONSTRAINT "pollen_levels_pkey" PRIMARY KEY ("forecastMunicipalityId","forecastDate","type")
);

-- CreateTable
CREATE TABLE "municipalities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "localName" TEXT,
    "subdivisionId" INTEGER,
    "countryCode" TEXT NOT NULL,
    "freeformAddress" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "municipalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subdivisions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT,
    "countryCode" TEXT NOT NULL,
    "parentSubdivisionId" INTEGER,

    CONSTRAINT "subdivisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "codeISO3" TEXT NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_mainMunicipalityId_fkey" FOREIGN KEY ("mainMunicipalityId") REFERENCES "municipalities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entries" ADD CONSTRAINT "entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entries" ADD CONSTRAINT "entries_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipalities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecasts" ADD CONSTRAINT "forecasts_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipalities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pollen_levels" ADD CONSTRAINT "pollen_levels_forecastMunicipalityId_forecastDate_fkey" FOREIGN KEY ("forecastMunicipalityId", "forecastDate") REFERENCES "forecasts"("municipalityId", "date") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "municipalities" ADD CONSTRAINT "municipalities_subdivisionId_fkey" FOREIGN KEY ("subdivisionId") REFERENCES "subdivisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "municipalities" ADD CONSTRAINT "municipalities_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "countries"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subdivisions" ADD CONSTRAINT "subdivisions_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "countries"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subdivisions" ADD CONSTRAINT "subdivisions_parentSubdivisionId_fkey" FOREIGN KEY ("parentSubdivisionId") REFERENCES "subdivisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
