/*
  Warnings:

  - Added the required column `clientName` to the `Pengajuan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectLocation` to the `Pengajuan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pengajuan" ADD COLUMN     "clientName" TEXT NOT NULL,
ADD COLUMN     "projectLocation" TEXT NOT NULL;
