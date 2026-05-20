const calculateNutrition = (data) => {
    const { peso, altura, edad, sexo, act } = data;
    const alturaM = altura / 100;

    // 1. IMC
    const imc = peso / (alturaM * alturaM);

    // 2. TMB (Mifflin-St Jeor)
    let tmb = (10 * peso) + (6.25 * altura) - (5 * edad);
    tmb = (sexo === 'M') ? tmb + 5 : tmb - 161;

    // 3. GET (Gasto Energético Total)
    const factoresActividad = {
        'sedentario': 1.2,
        'ligero': 1.375,
        'moderado': 1.55,
        'activo': 1.725
    };
    const get = tmb * (factoresActividad[act] || 1.2);

    // 4. Ajuste por objetivo (Déficit moderado para salud)
    let kcalObjetivo = Math.round(get * 0.85); // Ejemplo: -15%

    // Límites de seguridad
    if (sexo === 'M' && kcalObjetivo < 1500) kcalObjetivo = 1500;
    if (sexo === 'F' && kcalObjetivo < 1200) kcalObjetivo = 1200;

    // 5. Macros (Orden: Prot, Grasas, Carbs)
    const macroProteinas = Math.round(peso * 1.8);
    const macroGrasas = Math.round((kcalObjetivo * 0.25) / 9);
    const macroCarbs = Math.round((kcalObjetivo - (macroProteinas * 4) - (macroGrasas * 9)) / 4);

    return {
        imc: parseFloat(imc.toFixed(2)),
        kcalObjetivo,
        macroProteinas,
        macroGrasas,
        macroCarbs
    };
};

module.exports = { calculateNutrition };