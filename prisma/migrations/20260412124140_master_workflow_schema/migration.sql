/*
  Warnings:

  - You are about to drop the column `amount` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `isPaid` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `pengajuanId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Pengajuan` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[invoiceNumber]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invoiceNumber` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terbilang` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientName` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectLocation` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PENGAJUAN', 'DEAL_SCHEDULED', 'IN_PROGRESS', 'COMPLETED_INVOICED', 'PAID');

-- CreateEnum
CREATE TYPE "DocType" AS ENUM ('BAP', 'INVOICE');

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_pengajuanId_fkey";

-- DropForeignKey
ALTER TABLE "Pengajuan" DROP CONSTRAINT "Pengajuan_userId_fkey";

-- DropIndex
DROP INDEX "Invoice_pengajuanId_key";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "amount",
DROP COLUMN "createdAt",
DROP COLUMN "isPaid",
DROP COLUMN "pengajuanId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "invoiceNumber" TEXT NOT NULL,
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "terbilang" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "description",
DROP COLUMN "imageUrl",
ADD COLUMN     "clientAddress" TEXT,
ADD COLUMN     "clientCompany" TEXT,
ADD COLUMN     "clientName" TEXT NOT NULL,
ADD COLUMN     "clientPhone" TEXT,
ADD COLUMN     "dpAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "projectLocation" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'PENGAJUAN',
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "signatureUrl" TEXT;

-- DropTable
DROP TABLE "Pengajuan";

-- DropEnum
DROP TYPE "StatusPengajuan";

-- CreateTable
CREATE TABLE "PengajuanItem" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "qty" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "PengajuanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bap" (
    "id" TEXT NOT NULL,
    "bapNumber" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Bap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BapItem" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "qty" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "bapId" TEXT NOT NULL,

    CONSTRAINT "BapItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BapAttachment" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bapId" TEXT NOT NULL,

    CONSTRAINT "BapAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentCounter" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "type" "DocType" NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DocumentCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bap_bapNumber_key" ON "Bap"("bapNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Bap_projectId_key" ON "Bap"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentCounter_year_type_key" ON "DocumentCounter"("year", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_projectId_key" ON "Invoice"("projectId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengajuanItem" ADD CONSTRAINT "PengajuanItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bap" ADD CONSTRAINT "Bap_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BapItem" ADD CONSTRAINT "BapItem_bapId_fkey" FOREIGN KEY ("bapId") REFERENCES "Bap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BapAttachment" ADD CONSTRAINT "BapAttachment_bapId_fkey" FOREIGN KEY ("bapId") REFERENCES "Bap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
