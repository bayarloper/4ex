-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Market Analysis',
ADD COLUMN     "impact" TEXT,
ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false;
