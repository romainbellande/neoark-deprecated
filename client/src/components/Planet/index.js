import _ from 'lodash';
import { withRouter } from 'react-router-dom';

import { withPlanetContext } from '../../common/providers/PlanetProvider';
import Planet from './Planet';

export default _.flow([
  withRouter,
  withPlanetContext(
    ({ planet, inventory, processors, production }) => ({
      planet,
      inventory,
      processors,
      production,
    }),
    ({ fetchPlanet }) => ({
      fetchPlanet,
    })
  ),
])(Planet);
