-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "dashboardDietId" INTEGER;

-- CreateTable
CREATE TABLE "DashboardDiet" (
    "id" SERIAL NOT NULL,
    "calorias_objetivo" INTEGER NOT NULL,
    "calorias_totales" INTEGER NOT NULL,
    "macros1" INTEGER NOT NULL,
    "macros2" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardDiet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardSport" (
    "id" SERIAL NOT NULL,
    "actividades" INTEGER NOT NULL,
    "semana" INTEGER NOT NULL,
    "ejercicios" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardSport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "dashboardDietId" INTEGER NOT NULL,
    "dashboardSportId" INTEGER NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_dashboardDietId_fkey" FOREIGN KEY ("dashboardDietId") REFERENCES "DashboardDiet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_dashboardDietId_fkey" FOREIGN KEY ("dashboardDietId") REFERENCES "DashboardDiet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_dashboardSportId_fkey" FOREIGN KEY ("dashboardSportId") REFERENCES "DashboardSport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
