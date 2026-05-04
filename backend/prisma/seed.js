const prisma = require("../src/config/prisma");

const fs = require("fs");

const path = require("path");

async function main() {
  const dietasPath = path.join(__dirname, "data/dietas.json");
  const jsonDietas = JSON.parse(fs.readFileSync(dietasPath, "utf8"));

  console.log("Iniciando sembrado de dietas...");
  for (const dieta of jsonDietas.dietas) {
    const dbDiet = await prisma.diet.upsert({
      where: { title: dieta.titulo },
      update: {
        subtitle: dieta.subtitulo,
        image: dieta.imagen,
      },
      create: {
        title: dieta.titulo,
        subtitle: dieta.subtitulo,
        image: dieta.imagen,
      },
    });

    const todasLasComidas = dieta.plan.flatMap((p) =>
      p.comidas.map((c) => ({ ...c, momento: p.momento })),
    );

    for (const receta of todasLasComidas) {
      await prisma.recipe.upsert({
        where: { name: receta.nombre }, // Busca por nombre de receta
        update: {
          image: receta.imagen,
          instructions: receta.instrucciones,
          duration: parseInt(receta.tiempo.replace(/\D/g, "")),
          calories: parseInt(receta.calorias.replace(/\D/g, "")),
          macros: [
            receta.macros.proteinas.replace("g", ""),
            receta.macros.grasas.replace("g", ""),
            receta.macros.carbos.replace("g", ""),
          ],
          moment: receta.momento.toUpperCase(),
          allergies: receta.alergenos,
          ingredients: receta.ingredientes,
        },
        create: {
          dietId: dbDiet.id,
          name: receta.nombre,
          image: receta.imagen,
          duration: parseInt(receta.tiempo.replace(/\D/g, "")),
          calories: parseInt(receta.calorias.replace(/\D/g, "")),
          macros: [
            receta.macros.proteinas.replace("g", ""),
            receta.macros.grasas.replace("g", ""),
            receta.macros.carbos.replace("g", ""),
          ],
          moment: receta.momento.toUpperCase(),
          instructions: receta.instrucciones,
          allergies: receta.alergenos,
          ingredients: receta.ingredientes,
        },
      });
    }
  }

  const deportesPath = path.join(__dirname, "data/deportes.json");
  const jsonDeportes = JSON.parse(fs.readFileSync(deportesPath, "utf8"));

  console.log("Iniciando sembrado de deportes...");
  for (const deporte of jsonDeportes.deportes) {
    const dbPlan = await prisma.exercisePlan.upsert({
      where: { title: deporte.titulo },
      update: {
        subtitle: deporte.subtitulo,
        image: deporte.imagen,
      },
      create: {
        title: deporte.titulo,
        subtitle: deporte.subtitulo,
        image: deporte.imagen,
      },
    });

    for (const bloque of deporte.plan) {
      for (const ejercicio of bloque.ejercicios) {
        // 2. Transformación de Stats: "3", "15", "30 seg" -> [3, 15, 30]
        const statsArray = [
          parseInt(ejercicio.estadisticas.series),
          parseInt(ejercicio.estadisticas.repeticiones),
          parseInt(ejercicio.estadisticas.descanso.replace(/\D/g, "")),
        ];

        // 3. Upsert del Ejercicio
        try {
          await prisma.exercise.upsert({
            where: { name: ejercicio.nombre },
            update: {
              image: ejercicio.imagen,
              duration: parseInt(ejercicio.tiempo.replace(/\D/g, "")),
              difficulty: ejercicio.dificultad,
              level: bloque.nivel.toUpperCase(),
              filters: ejercicio.filtros,
              muscles: ejercicio.musculos,
              stats: statsArray,
              gif: ejercicio.gif,
              exercisePlanId: dbPlan.id,
            },
            create: {
              name: ejercicio.nombre,
              image: ejercicio.imagen,
              duration: parseInt(ejercicio.tiempo.replace(/\D/g, "")),
              difficulty: ejercicio.dificultad,
              level: bloque.nivel.toUpperCase(),
              filters: ejercicio.filtros,
              muscles: ejercicio.musculos,
              stats: statsArray,
              gif: ejercicio.gif,
              exercisePlanId: dbPlan.id,
            },
          });
        } catch (error) {
          console.error(
            `\n❌ ERROR en ejercicio: "${ejercicio.nombre}" (ID: ${ejercicio.id})`,
          );
          console.error(`   Músculos enviados:`, ejercicio.musculos);
          console.error(`   Mensaje de Prisma: ${error.message}`);

          // Opcional: Detener el proceso al primer error para inspeccionar
          process.exit(1);
        }
      }
    }
  }

  console.log("Sembrado completado con éxito.");
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
