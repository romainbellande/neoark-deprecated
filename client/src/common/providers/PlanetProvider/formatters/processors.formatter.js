const processorsFormatter = (processors, recipes, buildingConfigurations) => {
  return processors.map(processor => {
    const { id, level, ratio, recipe: recipeId, upgrade_finish: upgradeFinish } = processor;
    const recipeItem = recipes.find(item => item.id === recipeId);
    const buildingConfiguration = buildingConfigurations[0];
    const upgradeCosts = buildingConfiguration.costs.map(({ id: costRecipeId, amount }) => ({
      id: costRecipeId,
      amount,
      name: recipes.find(item => item.id === costRecipeId).name,
    }));

    return {
      id,
      level,
      ratio: parseFloat(ratio),
      upgradeFinish: upgradeFinish ? upgradeFinish.secs_since_epoch * 1000 : null,
      upgradeCosts,
      recipe: recipeItem
        ? {
            id: recipeItem.id,
            name: recipeItem.name,
            speed: recipeItem.speed,
            input: recipeItem.i,
            output: recipeItem.o,
            conso: parseFloat(recipeItem.conso),
          }
        : null,
    };
  });
};

export default processorsFormatter;
