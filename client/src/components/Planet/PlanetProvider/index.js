import React, { createContext, useState } from 'react';
import { node } from 'prop-types';

import withContextFactory from '../../../helpers/with-context-factory';
import withWrapper from '../../../helpers/with-wrapper';
import buildingConfigurationssMock from '../../../mocks/building-configurations';
import buildingsMock from '../../../mocks/buildings';
import tilesJSON from './tiles';

export const PlanetContext = createContext();
export const withPlanetContext = withContextFactory(PlanetContext);

const PlanetProvider = ({ children }) => {
  const [tiles] = useState(tilesJSON);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [buildingConfigurations] = useState(buildingConfigurationssMock);
  const [buildings] = useState(buildingsMock);

  const value = {
    state: {
      tiles,
      buildings,
      selectedBuildingId,
      buildingConfigurations,
    },
    dispatch: {
      setSelectedBuildingId,
    },
  };

  return <PlanetContext.Provider value={value}>{children}</PlanetContext.Provider>;
};

PlanetProvider.propTypes = {
  children: node.isRequired,
};

export const withPlanetProvider = withWrapper(PlanetProvider);

export default PlanetProvider;
