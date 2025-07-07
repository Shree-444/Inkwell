-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_blogId_fkey";

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
