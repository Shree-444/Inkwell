/*
  Warnings:

  - You are about to drop the column `dislike` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "dislike",
DROP COLUMN "likes";
