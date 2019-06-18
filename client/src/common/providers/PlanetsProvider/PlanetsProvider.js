import React, { createContext, useState, useEffect } from 'react';
import { func, node, string } from 'prop-types';

import withContextFactory from '../../helpers/with-context-factory';

export const PlanetsContext = createContext();
export const withPlanetsContext = withContextFactory(PlanetsContext);

function PlanetsProvider({ client, children, token }) {
  const [planets, setPlanets] = useState([]);

  const fetchPlanets = async () => {
    const { data } = await client.get('/planets');
    setPlanets(data);
  };

  useEffect(() => {
    if (token !== null) {
      fetchPlanets();
    }
  }, [token, client]);

  const value = {
    state: {
      planets,
    },
    dispatch: {
      fetchPlanets,
    },
  };
  return <PlanetsContext.Provider value={value}>{children}</PlanetsContext.Provider>;
}

PlanetsProvider.propTypes = {
  client: func.isRequired,
  children: node.isRequired,
  token: string.isRequired,
};

export default PlanetsProvider;
