import React, { createContext, useState } from 'react';
import { node, func } from 'prop-types';

import withContextFactory from '../../../common/helpers/with-context-factory';
import buildingConfigurationssMock from '../../../common/mocks/building-configurations';
import buildingsMock from '../../../common/mocks/buildings';

export const PlanetContext = createContext();
export const withPlanetContext = withContextFactory(PlanetContext);

const PlanetProvider = ({ children, client }) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [buildingConfigurations] = useState(buildingConfigurationssMock);
  const [buildings] = useState(buildingsMock);
  const [inventory, setInventory] = useState(null);
  const [planet, setPlanet] = useState(null);
  const [processors, setProcessors] = useState([]);

  const fetchPlanet = async id => {
    const { data } = await client.get(`/planets/${id}`);
    setInventory(data.inventory);
    setPlanet(data.planet);
    setProcessors(data.processors);
    return data;
  };

  const upgradeBuildingById = async id => {
    return new Promise(resolve => resolve({ finished: 1560776697993 }));
  };

  const value = {
    state: {
      inventory,
      planet,
      processors,
      buildings,
      selectedBuildingId,
      buildingConfigurations,
    },
    dispatch: {
      setSelectedBuildingId,
      upgradeBuildingById,
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
