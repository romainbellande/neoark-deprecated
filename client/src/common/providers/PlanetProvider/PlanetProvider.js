import React, { createContext, useState } from 'react';
import { node, func } from 'prop-types';

import withContextFactory from '../../helpers/with-context-factory';
import buildingConfigurationssMock from '../../mocks/building-configurations';
import buildingsMock from '../../mocks/buildings';
import recipes from '../../mocks/recipes.json';

export const PlanetContext = createContext();
export const withPlanetContext = withContextFactory(PlanetContext);

const PlanetProvider = ({ children, client }) => {
  const formattedBuildingConfigurationsMock = buildingConfigurationssMock.map(
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

  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [buildingConfigurations] = useState(formattedBuildingConfigurationsMock);
  const [buildings] = useState(buildingsMock);
  const [inventory, setInventory] = useState(null);
  const [planet, setPlanet] = useState(null);
  const [processors, setProcessors] = useState([]);
  const [production, setProduction] = useState();
  const [electricity, setElectricity] = useState(null);

  const formatInventory = (myInventory, myProduction) =>
    Object.keys(myInventory).map(key => {
      const id = parseInt(key, 10);
      const amount = myInventory[id];
      const netAmount = Math.floor(amount);
      const currentPercent = Math.abs(amount - netAmount);
      const currentProduction = myProduction[id];
      let actualRate = 0;
      let producedRate = 0;

      if (currentProduction) {
        actualRate = currentProduction.actual_rate;
        producedRate = currentProduction.producing_rate;
      }

      const { name } = recipes.find(item => item.id === id);

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

  const formatElectricity = (myElectricity, myRecipes) => {
    const id = 3;
    const { produced, consumed, ratio } = myElectricity;
    const recipe = myRecipes.find(item => item.id === id);
    const { name } = recipe;

    return {
      id,
      name,
      netAmount: null,
      currentPercent: parseFloat(ratio).toFixed(2),
      consumed: parseFloat(consumed).toFixed(2),
      produced: parseFloat(produced).toFixed(2),
      consumedRate: parseFloat(consumed).toFixed(2),
      producedRate: parseFloat(produced).toFixed(2),
    };
  };

  const formatProcessors = (myProcessors, myRecipes) => {
    return myProcessors.map(processor => {
      const { id, level, ratio, recipe: recipeId, upgrade_finish: upgradeFinish } = processor;
      const recipeItem = myRecipes.find(item => item.id === recipeId);
      const buildingConfiguration = buildingConfigurationssMock[0];
      const upgradeCosts = buildingConfiguration.costs.map(({ id: costRecipeId, amount }) => ({
        id: costRecipeId,
        amount,
        name: myRecipes.find(item => item.id === costRecipeId).name,
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
            }
          : null,
      };
    });
  };

  const fetchPlanet = async id => {
    const { data } = await client.get(`/planets/${id}`);
    const formattedElectricity = formatElectricity(data.electricity, recipes);
    setElectricity(formattedElectricity);
    setPlanet(data.planet);
    const formattedProcessors = formatProcessors(data.processors, recipes);
    setProcessors(formattedProcessors);
    setProduction(data.production);
    const formattedInventory = formatInventory(data.inventory, data.production);
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
    },
  };

  return <PlanetContext.Provider value={value}>{children}</PlanetContext.Provider>;
};

PlanetProvider.propTypes = {
  children: node.isRequired,
  client: func.isRequired,
};

export default PlanetProvider;
