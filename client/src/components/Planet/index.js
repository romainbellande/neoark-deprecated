import _ from 'lodash';

import { withPlanetProvider, withPlanetContext } from './PlanetProvider';
import Planet from './Planet';

export default _.flow([
  withPlanetContext(
    ({ selectedBuildingId }) => ({ selectedBuildingId }),
    ({ setSelectedBuildingId }) => ({ setSelectedBuildingId })
  ),
  withPlanetProvider(),
])(Planet);
