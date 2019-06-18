import React, { createContext, useState } from 'react';
import { node, func } from 'prop-types';

import withContextFactory from '../../../common/helpers/with-context-factory';
import buildingConfigurationssMock from '../../../common/mocks/building-configurations';
import buildingsMock from '../../../common/mocks/buildings';
import recipes from '../../../common/mocks/recipes.json';

export const PlanetContext = createContext();
export const withPlanetContext = withContextFactory(PlanetContext);

const PlanetProvider = ({ children, client }) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [buildingConfigurations] = useState(buildingConfigurationssMock);
  const [buildings] = useState(buildingsMock);
  const [inventory, setInventory] = useState(null);
  const [planet, setPlanet] = useState(null);
  const [processors, setProcessors] = useState([]);
  const [production, setProduction] = useState();

  const formatProcessors = (myProcessors, myRecipes) => {
    return myProcessors.map(processor => {
      const { id, level, ratio, recipe: recipeId, upgrade_finish: upgradeFinish } = processor;
      const recipeItem = myRecipes.find(item => item.id === recipeId);

      return {
        id,
        level,
        ratio: parseFloat(ratio),
        upgradeFinish,
        recipe: {
          id: recipeItem.id,
          name: recipeItem.name,
          speed: recipeItem.speed,
          input: recipeItem.i,
          output: recipeItem.o,
        },
      };
    });
  };

  const fetchPlanet = async id => {
    const { data } = await client.get(`/planets/${id}`);
    setInventory(data.inventory);
    setPlanet(data.planet);
    const formattedProcessors = formatProcessors(data.processors, recipes);
    setProcessors(formattedProcessors);
    setProduction(data.production);
    return data;
  };

  const value = {
    state: {
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
    },
  };

  return <PlanetContext.Provider value={value}>{children}</PlanetContext.Provider>;
};

PlanetProvider.propTypes = {
  children: node.isRequired,
  client: func.isRequired,
};

export default PlanetProvider;
