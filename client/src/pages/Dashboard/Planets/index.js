import _ from 'lodash';

import { withPlanetsContext, withPlanetsProvider } from './PlanetsProvider';
import Planets from './Planets';

export default _.flow([
  withPlanetsContext(({ planets }) => ({ planets }), ({ fetchPlanets }) => ({ fetchPlanets })),
  withPlanetsProvider(),
])(Planets);
