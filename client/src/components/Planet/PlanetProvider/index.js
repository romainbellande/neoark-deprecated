import React, { createContext, useState } from 'react';
import { node } from 'prop-types';

import withContextFactory from '../../../common/helpers/with-context-factory';
import withWrapper from '../../../common/helpers/with-wrapper';
import buildingConfigurationssMock from '../../../common/mocks/building-configurations';
import buildingsMock from '../../../common/mocks/buildings';
import tilesJSON from './tiles';

export const PlanetContext = createContext();
export const withPlanetContext = withContextFactory(PlanetContext);

const PlanetProvider = ({ children }) => {
  const [tiles] = useState(tilesJSON);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [buildingConfigurations] = useState(buildingConfigurationssMock);
  const [buildings] = useState(buildingsMock);

  const upgradeBuildingById = async id => {
    console.log('upgrade building with id: ', id);
    return new Promise(resolve => resolve({ finished: 1560776697993 }));
  };

  const value = {
    state: {
      tiles,
      buildings,
      selectedBuildingId,
      buildingConfigurations,
    },
    dispatch: {
      setSelectedBuildingId,
      upgradeBuildingById,
    },
  };

  return <PlanetContext.Provider value={value}>{children}</PlanetContext.Provider>;
};

PlanetProvider.propTypes = {
  children: node.isRequired,
};

export const withPlanetProvider = withWrapper(PlanetProvider);

export default PlanetProvider;
