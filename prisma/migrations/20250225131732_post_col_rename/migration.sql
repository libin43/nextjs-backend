/*
  Warnings:

  - You are about to drop the column `created_by_user_id` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_user_id` on the `Post` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "created_by_user_id",
DROP COLUMN "updated_by_user_id",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedById" TEXT NOT NULL;
