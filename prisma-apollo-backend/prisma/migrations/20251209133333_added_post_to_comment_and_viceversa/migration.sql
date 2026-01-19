/*
  Warnings:

  - Added the required column `postId` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feedId` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "postId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "feedId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "Feeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
