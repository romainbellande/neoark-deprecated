import React, { useEffect, useState } from 'react';
import { shape, func, arrayOf } from 'prop-types';

import items from '../../common/mocks/items';
import Processors from './Processors';

const Planet = ({ match, fetchPlanet, production, inventory, planet, processors }) => {
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
        const netRate = resourceProduction ? resourceProduction.actual_rate : 0;
        const rate = resourceProduction ? resourceProduction.producing_rate : 0;
        const value = inventory[key];

        return {
          id,
          name,
          value,
          rate: parseFloat(netRate),
          netRate: parseFloat(rate),
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
        <Processors processors={processors} resources={resources} items={items} />
      </div>
    )
  );
};

Planet.propTypes = {
  production: shape({}),
  processors: arrayOf(shape({})),
  planet: shape({}),
  inventory: shape({}),
  match: shape({
    params: shape({}).isRequired,
  }).isRequired,
  fetchPlanet: func.isRequired,
};

Planet.defaultProps = {
  processors: [],
  production: null,
  planet: null,
  inventory: null,
};

export default Planet;
