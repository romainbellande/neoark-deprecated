import _ from 'lodash';

import withWrapper from '../../common/helpers/with-wrapper';
import PlanetProvider, { withPlanetContext } from './PlanetProvider';
import Planet from './Planet';

export default _.flow([
  withPlanetContext(
    ({ selectedBuildingId }) => ({ selectedBuildingId }),
    ({ setSelectedBuildingId, upgradeBuildingById }) => ({
      setSelectedBuildingId,
      upgradeBuildingById,
    })
  ),
  withWrapper(PlanetProvider)(),
])(Planet);
