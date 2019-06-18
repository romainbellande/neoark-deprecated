import _ from 'lodash';

import Initializer from './Initializer';
import { withPlanetsContext } from '../../../common/providers/PlanetsProvider';
import { withPlanetContext } from '../../../common/providers/PlanetProvider';

export default _.flow([
  withPlanetsContext(({ planets }) => ({ planets })),
  withPlanetContext(null, ({ fetchPlanet }) => ({ fetchPlanet })),
])(Initializer);
