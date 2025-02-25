/*
  Warnings:

  - You are about to drop the column `created_by_user_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_user_id` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "created_by_user_id",
DROP COLUMN "updated_by_user_id";
