import React from 'react';
import { Redirect } from 'react-router-dom';
import { shape } from 'prop-types';

import PlanetsProvider from '../../common/providers/PlanetsProvider';
import PlanetProvider from '../../common/providers/PlanetProvider';
import Initializer from './Initializer';
import Paperbase from './Layout';

const Dashboard = ({ user }) => {
  return user ? (
    <PlanetsProvider>
      <PlanetProvider>
        <Initializer>
          <Paperbase />
        </Initializer>
      </PlanetProvider>
    </PlanetsProvider>
  ) : (
    <Redirect to="/portal/login" />
  );
};

Dashboard.propTypes = {
  user: shape({}),
};

Dashboard.defaultProps = {
  user: null,
};

export default Dashboard;
