/*
  Warnings:

  - A unique constraint covering the columns `[roomsId]` on the table `Feeds` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Feeds" ADD COLUMN     "roomsId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Feeds_roomsId_key" ON "Feeds"("roomsId");

-- AddForeignKey
ALTER TABLE "Feeds" ADD CONSTRAINT "Feeds_roomsId_fkey" FOREIGN KEY ("roomsId") REFERENCES "Rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
