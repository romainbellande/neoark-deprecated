import _ from 'lodash';
import { withRouter } from 'react-router-dom';

import withWrapper from '../../common/helpers/with-wrapper';
import PlanetProvider, { withPlanetContext } from './PlanetProvider';
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
  withWrapper(PlanetProvider)(),
])(Planet);
