const buildingConfigurationsFormatter = (buildingConfigurations, recipes) =>
  buildingConfigurations.map(
    ({ id, name, level_multiplier: levelMultiplier, energy_cost: energyCost, costs }) => ({
      id,
      name,
      levelMultiplier,
      energyCost,
      costs: costs.map(({ id: costId, amount }) => ({
        id: costId,
        amount,
        name: recipes.find(({ id: recipeId }) => recipeId === costId).name,
      })),
    })
  );

export default buildingConfigurationsFormatter;
