-- CreateEnum
CREATE TYPE "Allergies" AS ENUM ('huevos', 'gluten', 'lacteos', 'crustaceos', 'pescado', 'mani');

-- CreateEnum
CREATE TYPE "AllergiesIcons" AS ENUM ('egg', 'bakery_dining', 'set_meal', 'local_drink', 'eco');

-- CreateEnum
CREATE TYPE "Moment" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "FilterExercise" AS ENUM ('no_material', 'full_body', 'upper_body', 'lower_body');

-- CreateEnum
CREATE TYPE "MuscleGroups" AS ENUM ('ABS', 'CORE', 'SHOULDERS');

-- CreateTable
CREATE TABLE "Diet" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,

    CONSTRAINT "Diet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "dietId" INTEGER,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "calories" INTEGER NOT NULL,
    "allergies" "Allergies"[],
    "ingredients" TEXT[],
    "macros" TEXT[],
    "moment" "Moment" NOT NULL,
    "instructions" TEXT NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExercisePlan" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,

    CONSTRAINT "ExercisePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "exercisePlanId" INTEGER,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "filtros" "FilterExercise"[],
    "muscles" "MuscleGroups"[],
    "stats" TEXT[],
    "instructions" TEXT NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_dietId_fkey" FOREIGN KEY ("dietId") REFERENCES "Diet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_exercisePlanId_fkey" FOREIGN KEY ("exercisePlanId") REFERENCES "ExercisePlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
