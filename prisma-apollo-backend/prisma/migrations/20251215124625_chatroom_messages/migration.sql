/*
  Warnings:

  - Added the required column `roomsId` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "roomsId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_roomsId_fkey" FOREIGN KEY ("roomsId") REFERENCES "Rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
