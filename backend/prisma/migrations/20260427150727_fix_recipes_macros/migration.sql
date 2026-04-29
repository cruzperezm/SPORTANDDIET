/*
  Warnings:

  - The values [mani] on the enum `Allergies` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Allergies_new" AS ENUM ('huevos', 'gluten', 'lacteos', 'crustaceos', 'pescado', 'frutos_secos');
ALTER TABLE "Recipe" ALTER COLUMN "allergies" TYPE "Allergies_new"[] USING ("allergies"::text::"Allergies_new"[]);
ALTER TYPE "Allergies" RENAME TO "Allergies_old";
ALTER TYPE "Allergies_new" RENAME TO "Allergies";
DROP TYPE "public"."Allergies_old";
COMMIT;

-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "macros" SET DATA TYPE TEXT[];
