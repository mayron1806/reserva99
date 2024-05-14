/*
  Warnings:

  - Added the required column `description` to the `Reserve` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Reserve` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Reserve` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reserve" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;
