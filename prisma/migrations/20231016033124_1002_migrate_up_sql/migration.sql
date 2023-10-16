/*
  Warnings:

  - You are about to drop the column `title` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "title",
ADD COLUMN     "content" TEXT NOT NULL DEFAULT 'Default content';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "password" TEXT NOT NULL DEFAULT 'defaultPassword',
ADD COLUMN     "username" TEXT NOT NULL DEFAULT 'defaultUsername';
