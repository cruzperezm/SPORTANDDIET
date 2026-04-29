/*
  Warnings:

  - The values [BREAKFAST,LUNCH,DINNER] on the enum `Moment` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Moment_new" AS ENUM ('DESAYUNO', 'ALMUERZO', 'CENA');
ALTER TABLE "Recipe" ALTER COLUMN "moment" TYPE "Moment_new" USING ("moment"::text::"Moment_new");
ALTER TYPE "Moment" RENAME TO "Moment_old";
ALTER TYPE "Moment_new" RENAME TO "Moment";
DROP TYPE "public"."Moment_old";
COMMIT;
