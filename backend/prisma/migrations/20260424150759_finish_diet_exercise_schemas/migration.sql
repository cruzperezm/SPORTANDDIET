/*
  Warnings:

  - You are about to drop the column `instructions` on the `Exercise` table. All the data in the column will be lost.
  - The `stats` column on the `Exercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ingredients` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `image` to the `Diet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gif` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Diet" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "instructions",
ADD COLUMN     "gif" TEXT NOT NULL,
DROP COLUMN "stats",
ADD COLUMN     "stats" INTEGER[];

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "ingredients",
ADD COLUMN     "ingredients" INTEGER[];
