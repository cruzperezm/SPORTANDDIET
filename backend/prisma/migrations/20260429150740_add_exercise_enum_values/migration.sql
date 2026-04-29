/*
  Warnings:

  - The values [no_material,full_body,upper_body,lower_body] on the enum `FilterExercise` will be removed. If these variants are still used in the database, this will fail.
  - The values [BEGINNER,INTERMEDIATE,ADVANCED] on the enum `Level` will be removed. If these variants are still used in the database, this will fail.
  - The values [ABS,CORE,SHOULDERS] on the enum `MuscleGroups` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FilterExercise_new" AS ENUM ('peso_corporal', 'polea', 'barra', 'asistido', 'pelota_pilates', 'cuerda', 'rodillo', 'maquina_palanca', 'mancuernas', 'stationary_bike', 'eliptica', 'escaladora', 'balon_medicinal', 'banda_elastica');
ALTER TABLE "Exercise" ALTER COLUMN "filtros" TYPE "FilterExercise_new"[] USING ("filtros"::text::"FilterExercise_new"[]);
ALTER TYPE "FilterExercise" RENAME TO "FilterExercise_old";
ALTER TYPE "FilterExercise_new" RENAME TO "FilterExercise";
DROP TYPE "public"."FilterExercise_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Level_new" AS ENUM ('PRINCIPIANTE', 'INTERMEDIO', 'AVANZADOS');
ALTER TABLE "Exercise" ALTER COLUMN "level" TYPE "Level_new" USING ("level"::text::"Level_new");
ALTER TYPE "Level" RENAME TO "Level_old";
ALTER TYPE "Level_new" RENAME TO "Level";
DROP TYPE "public"."Level_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MuscleGroups_new" AS ENUM ('Piernas', 'Cuadriceps', 'Gemelos', 'Espalda', 'Dorsales', 'Pecho', 'Pectorales', 'Gluteos', 'Abdominales', 'Cardio', 'Hombros', 'Espalda_alta', 'Biceps', 'Brazos', 'Triceps', 'Aductores', 'Deltoides', 'Core', 'Isquiotibiales', 'Columna', 'Cuello', 'Antebrazos', 'Trapecios');
ALTER TABLE "Exercise" ALTER COLUMN "muscles" TYPE "MuscleGroups_new"[] USING ("muscles"::text::"MuscleGroups_new"[]);
ALTER TYPE "MuscleGroups" RENAME TO "MuscleGroups_old";
ALTER TYPE "MuscleGroups_new" RENAME TO "MuscleGroups";
DROP TYPE "public"."MuscleGroups_old";
COMMIT;
