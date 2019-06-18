import React, { useEffect, useState } from 'react';
import { shape, func } from 'prop-types';

import Resources from './Resources';
import items from '../../common/mocks/items';

const Planet = ({ match, fetchPlanet, production, inventory, planet }) => {
  const [isPlanetLoaded, setIsPlanetLoaded] = useState(false);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const isPlanetLoadedValue = planet && inventory && production;
    setIsPlanetLoaded(isPlanetLoadedValue);
    if (isPlanetLoadedValue) {
      const resourcesValue = Object.keys(inventory).map(key => {
        const resourceItem = items.find(item => item.id === parseInt(key, 10));
        const resourceProduction = production[key];
        const { id, name } = resourceItem;
        const { rate, net_rate: netRate } = resourceProduction;
        const value = inventory[key];

        return {
          id,
          name,
          value,
          rate: parseFloat(rate),
          netRate: parseFloat(netRate),
        };
      });

      setResources(resourcesValue);
    }
  }, [planet, inventory, production]);

  useEffect(() => {
    fetchPlanet(match.params.id);
  }, [match.params.id]);

  return (
    isPlanetLoaded && (
      <div>
        <Resources resources={resources} />
      </div>
    )
  );
};

Planet.propTypes = {
  production: shape({}),
  planet: shape({}),
  inventory: shape({}),
  match: shape({
    params: shape({}).isRequired,
  }).isRequired,
  fetchPlanet: func.isRequired,
};

Planet.defaultProps = {
  production: null,
  planet: null,
  inventory: null,
};

export default Planet;
