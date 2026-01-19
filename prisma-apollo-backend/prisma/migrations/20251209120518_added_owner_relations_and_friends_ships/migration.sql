/*
  Warnings:

  - Added the required column `userId` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Feeds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Feeds" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Rooms" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_userId_friendId_key" ON "Friendship"("userId", "friendId");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_friendId_userId_key" ON "Friendship"("friendId", "userId");

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feeds" ADD CONSTRAINT "Feeds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
