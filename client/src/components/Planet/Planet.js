import React from 'react';
import { number, func } from 'prop-types';

import PlanetMap from './PlanetMap';
import AppDialog from '../AppDialog';
import Building from './Building';

const Planet = ({ selectedBuildingId, setSelectedBuildingId }) => {
  const isBuildingOpen = selectedBuildingId !== null;

  const onAppDialogClose = () => {
    setSelectedBuildingId(null);
  };

  return (
    <div>
      <PlanetMap />
      <AppDialog open={isBuildingOpen} onClose={onAppDialogClose}>
        {isBuildingOpen && <Building />}
      </AppDialog>
    </div>
  );
};

Planet.propTypes = {
  selectedBuildingId: number,
  setSelectedBuildingId: func.isRequired,
};

Planet.defaultProps = {
  selectedBuildingId: null,
};

export default Planet;
