import React from 'react';
import { number, func } from 'prop-types';

import PlanetMap from './PlanetMap';
import AppDialog from '../AppDialog';
import Building from './Building';

const Planet = ({ selectedBuildingId, setSelectedBuildingId, upgradeBuildingById }) => {
  const isBuildingOpen = selectedBuildingId !== null;

  const onAppDialogClose = () => {
    setSelectedBuildingId(null);
  };

  const onBuildingUpgrade = async () => {
    await upgradeBuildingById(selectedBuildingId);
    setSelectedBuildingId(null);
  };

  return (
    <div>
      <PlanetMap />
      <AppDialog open={isBuildingOpen} onClose={onAppDialogClose}>
        {isBuildingOpen && <Building onUpgrade={onBuildingUpgrade} />}
      </AppDialog>
    </div>
  );
};

Planet.propTypes = {
  selectedBuildingId: number,
  setSelectedBuildingId: func.isRequired,
  upgradeBuildingById: func.isRequired,
};

Planet.defaultProps = {
  selectedBuildingId: null,
};

export default Planet;
