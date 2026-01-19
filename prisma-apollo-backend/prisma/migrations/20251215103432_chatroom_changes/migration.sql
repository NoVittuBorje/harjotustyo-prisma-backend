-- CreateTable
CREATE TABLE "_InChatroom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InChatroom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_InChatroom_B_index" ON "_InChatroom"("B");

-- AddForeignKey
ALTER TABLE "_InChatroom" ADD CONSTRAINT "_InChatroom_A_fkey" FOREIGN KEY ("A") REFERENCES "Rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InChatroom" ADD CONSTRAINT "_InChatroom_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
