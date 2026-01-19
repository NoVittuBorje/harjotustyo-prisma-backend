-- CreateTable
CREATE TABLE "_FeedSubscriptions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FeedSubscriptions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FeedSubscriptions_B_index" ON "_FeedSubscriptions"("B");

-- AddForeignKey
ALTER TABLE "_FeedSubscriptions" ADD CONSTRAINT "_FeedSubscriptions_A_fkey" FOREIGN KEY ("A") REFERENCES "Feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeedSubscriptions" ADD CONSTRAINT "_FeedSubscriptions_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
