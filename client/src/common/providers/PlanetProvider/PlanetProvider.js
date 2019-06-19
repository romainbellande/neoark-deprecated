import React, { createContext, useState } from 'react';
import { node, func } from 'prop-types';

import withContextFactory from '../../helpers/with-context-factory';
import buildingConfigurationsMock from '../../mocks/building-configurations';
import buildingsMock from '../../mocks/buildings';
import recipes from '../../mocks/recipes.json';
import items from '../../mocks/items.json';
import buildingConfigurationsFormatter from './formatters/building-configurations.formatter';
import electricityFormatter from './formatters/electricity.formatter';
import inventoryFormatter from './formatters/inventory.formatter';
import processorsFormatter from './formatters/processors.formatter';

export const PlanetContext = createContext();
export const withPlanetContext = withContextFactory(PlanetContext);

const PlanetProvider = ({ children, client }) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [buildingConfigurations] = useState(
    buildingConfigurationsFormatter(buildingConfigurationsMock, recipes)
  );
  const [buildings] = useState(buildingsMock);
  const [inventory, setInventory] = useState(null);
  const [planet, setPlanet] = useState(null);
  const [processors, setProcessors] = useState([]);
  const [production, setProduction] = useState();
  const [electricity, setElectricity] = useState(null);

  const fetchPlanet = async id => {
    const { data } = await client.get(`/planets/${id}`);
    const formattedElectricity = electricityFormatter(data.electricity);
    setElectricity(formattedElectricity);
    setPlanet(data.planet);
    const formattedProcessors = processorsFormatter(
      data.processors,
      recipes,
      buildingConfigurationsMock
    );
    setProcessors(formattedProcessors);
    setProduction(data.production);
    const formattedInventory = inventoryFormatter(items, data.inventory, data.production);
    setInventory(formattedInventory);
    return data;
  };

  const fetchCurrentPlanet = () => fetchPlanet(planet.id);

  const upgradeProcessor = async id => {
    await client.put(`/processors/${id}/upgrade`);
    await fetchCurrentPlanet();
  };

  const buyProcessor = async () => {
    await client.post(`/processors/${planet.id}`);
    await fetchCurrentPlanet();
  };

  const changeProcessorRecipe = async (processorId, recipeId) => {
    await client.put(`/processors/${processorId}/set_recipe/${recipeId}`);
    await fetchCurrentPlanet();
  };

  const getProcessor = processorId => processors.find(({ id }) => processorId === id);

  // Production Management (TODO: to move)
  const getMaxProcessorProduction = processorId => {
    const { level, recipe } = getProcessor(processorId);
    return recipe.speed * level * 1.1 ** level;
  };

  const getProcessorProduction = processorId => {
    const { ratio } = getProcessor(processorId);
    return getMaxProcessorProduction(processorId) * ratio;
  };

  const getProcessorsByRecipeId = recipeId =>
    processors.filter(({ recipe }) => recipe && recipe.id === recipeId);

  const getMaxProcessorsProductionByRecipeId = recipeId =>
    getProcessorsByRecipeId(recipeId)
      .map(({ id }) => getMaxProcessorProduction(id))
      .reduce((prev, current) => prev + current, 0);

  const getProcessorsProductionByRecipeId = recipeId =>
    getProcessorsByRecipeId(recipeId)
      .map(({ id }) => getProcessorProduction(id))
      .reduce((prev, current) => prev + current, 0);

  // Electricity Management (TODO: to move)

  const getMaxProcessorElectricityConsumption = processorId => {
    const { recipe, level } = getProcessor(processorId);
    return (recipe.conso * level * 1.1 ** level).toFixed(1);
  };

  const getProcessorElectricityConsumption = processorId =>
    (getMaxProcessorElectricityConsumption(processorId) * electricity.currentPercent).toFixed(1);

  const getGeneratorProduction = generatorId => {
    const generator = getProcessor(generatorId);
    const recipe = recipes.find(({ id }) => id === 3);
    const value = recipe.speed * generator.level * 1.1 ** generator.level;
    return value.toFixed(1);
  };

  const getGenerators = () => processors.filter(({ recipe }) => recipe.id === 3);

  const getTotalElectricityProduction = () =>
    getGenerators().map(({ id }) => getGeneratorProduction(id));

  const getMaxTotalElectricityConsumption = () =>
    processors
      .filter(({ id }) => id !== 3)
      .map(({ id }) => getMaxProcessorElectricityConsumption(id));

  const getTotalElectricityConsumption = () =>
    Math.floor(getMaxTotalElectricityConsumption() * electricity.currentPercent);

  // Resource Management (TODO: to move)

  const getInventoryItem = inventoryItemId => {
    return inventory.find(({ id }) => id === inventoryItemId);
  };

  const getInventoryItemInitialProgress = inventoryItemId =>
    getInventoryItem(inventoryItemId).currentPercent;

  const getInventoryItemDurationInMs = inventoryItemId =>
    (1 / getProcessorsProductionByRecipeId(inventoryItemId)) * 3600 * 1000;

  const getInventoryItemRemainingTimeInMs = inventoryItemId => {
    const percent = getInventoryItemInitialProgress(inventoryItemId);
    const percentRest = (100 - percent * 100) / 100;
    return percentRest * getInventoryItemDurationInMs(inventoryItemId);
  };

  const value = {
    state: {
      electricity,
      inventory,
      planet,
      processors,
      buildings,
      selectedBuildingId,
      buildingConfigurations,
      production,
    },
    dispatch: {
      getInventoryItemInitialProgress,
      setSelectedBuildingId,
      fetchPlanet,
      fetchCurrentPlanet,
      upgradeProcessor,
      buyProcessor,
      changeProcessorRecipe,
      getProcessorElectricityConsumption,
      getMaxProcessorElectricityConsumption,
      getMaxTotalElectricityConsumption,
      getTotalElectricityConsumption,
      getTotalElectricityProduction,
      getGeneratorProduction,
      getMaxProcessorsProductionByRecipeId,
      getProcessorsProductionByRecipeId,
      getInventoryItemDurationInMs,
      getInventoryItemRemainingTimeInMs,
    },
  };

  return <PlanetContext.Provider value={value}>{children}</PlanetContext.Provider>;
};

PlanetProvider.propTypes = {
  children: node.isRequired,
  client: func.isRequired,
};

export default PlanetProvider;
