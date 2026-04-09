/*
  Warnings:

  - You are about to drop the column `weight` on the `Biometrics` table. All the data in the column will be lost.
  - You are about to alter the column `height` on the `Biometrics` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `activity` to the `Biometrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `Biometrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `c_weight` to the `Biometrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `d_weight` to the `Biometrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genre` to the `Biometrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goal` to the `Biometrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weeks` to the `Biometrics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Biometrics" DROP COLUMN "weight",
ADD COLUMN     "activity" TEXT NOT NULL,
ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "c_weight" INTEGER NOT NULL,
ADD COLUMN     "d_weight" INTEGER NOT NULL,
ADD COLUMN     "genre" TEXT NOT NULL,
ADD COLUMN     "goal" TEXT NOT NULL,
ADD COLUMN     "weeks" INTEGER NOT NULL,
ALTER COLUMN "height" SET DATA TYPE INTEGER;
