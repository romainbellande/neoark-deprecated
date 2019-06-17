import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { withPlanetContext } from '../PlanetProvider';

import PlanetMap from './PlanetMap';

export default _.flow([
  withPlanetContext(
    ({ tiles }) => ({ tiles }),
    ({ setSelectedBuildingId }) => ({ setSelectedBuildingId })
  ),
  withRouter,
])(PlanetMap);
