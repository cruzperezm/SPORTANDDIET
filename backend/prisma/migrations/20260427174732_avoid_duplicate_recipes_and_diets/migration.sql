/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Diet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Diet_title_key" ON "Diet"("title");
