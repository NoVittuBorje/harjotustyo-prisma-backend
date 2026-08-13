/*
  Warnings:

  - Made the column `karma` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "karma" SET NOT NULL,
ALTER COLUMN "karma" SET DEFAULT 0;
