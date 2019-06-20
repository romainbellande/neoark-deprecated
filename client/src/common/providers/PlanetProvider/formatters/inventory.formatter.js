const inventoryFormatter = (items, inventory, production) =>
  Object.keys(inventory).map(itemId => {
    const id = items[parseInt(itemId, 10)].recipeId;
    const amount = inventory[itemId];
    const netAmount = Math.floor(amount);
    const currentPercent = Math.abs(amount - netAmount);
    const currentProduction = production[id];
    let actualRate = 0;
    let producedRate = 0;

    if (currentProduction) {
      actualRate = currentProduction.actual_rate;
      producedRate = currentProduction.producing_rate;
    }

    const { name } = items[itemId];

    return {
      id,
      name,
      netAmount,
      currentPercent,
      consumed: parseFloat(actualRate).toFixed(2),
      produced: parseFloat(producedRate).toFixed(2),
      consumedRate: parseFloat(actualRate).toFixed(2),
      producedRate: parseFloat(producedRate).toFixed(2),
    };
  });

export default inventoryFormatter;
