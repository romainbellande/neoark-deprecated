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
  const [production, setProduction] = useState();

  const fetchPlanet = async id => {
    const { data } = await client.get(`/planets/${id}`);
    setInventory(data.inventory);
    setPlanet(data.planet);
    setProcessors(data.processors);
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
