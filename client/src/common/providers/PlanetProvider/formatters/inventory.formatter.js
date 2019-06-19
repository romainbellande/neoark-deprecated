const inventoryFormatter = (items, inventory, production) =>
  Object.keys(inventory).map(key => {
    const id = parseInt(key, 10);
    const amount = inventory[id];
    const netAmount = Math.floor(amount);
    const currentPercent = Math.abs(amount - netAmount);
    const currentProduction = production[id];
    let actualRate = 0;
    let producedRate = 0;

    if (currentProduction) {
      actualRate = currentProduction.actual_rate;
      producedRate = currentProduction.producing_rate;
    }

    const { name } = items.find(item => item.id === id);

    return {
      id,
      name,
      netAmount,
      currentPercent,
      consumed: parseFloat(actualRate).toFixed(2),
      produced: parseFloat(producedRate).toFixed(2),
      consumedRate: parseFloat(actualRate).toFixed(2),
      producedTate: parseFloat(producedRate).toFixed(2),
    };
  });

export default inventoryFormatter;
