import React, { createContext, useState } from 'react';
import { node, func } from 'prop-types';

import withContextFactory from '../../helpers/with-context-factory';
import buildingConfigurationssMock from '../../mocks/building-configurations';
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
    buildingConfigurationsFormatter(buildingConfigurationssMock, recipes)
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
      buildingConfigurationssMock
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

  // Electricity Management (TODO: to move)

  const getMaxProcessorElectricityConsumption = processorId => {
    const processor = getProcessor(processorId);
    return (processor.recipe.conso * processor.level *  1.1 ** processor.level).toFixed(1);
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
    },
  };

  return <PlanetContext.Provider value={value}>{children}</PlanetContext.Provider>;
};

PlanetProvider.propTypes = {
  children: node.isRequired,
  client: func.isRequired,
};

export default PlanetProvider;
