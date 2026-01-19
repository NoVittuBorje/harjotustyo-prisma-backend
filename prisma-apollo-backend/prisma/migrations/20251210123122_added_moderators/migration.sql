-- CreateTable
CREATE TABLE "_FeedModerator" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FeedModerator_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FeedModerator_B_index" ON "_FeedModerator"("B");

-- AddForeignKey
ALTER TABLE "_FeedModerator" ADD CONSTRAINT "_FeedModerator_A_fkey" FOREIGN KEY ("A") REFERENCES "Feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeedModerator" ADD CONSTRAINT "_FeedModerator_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
