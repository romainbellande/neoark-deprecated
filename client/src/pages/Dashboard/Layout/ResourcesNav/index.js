import ResourcesNav from './ResourcesNav';
import { withPlanetContext } from '../../../../common/providers/PlanetProvider/PlanetProvider';

export default withPlanetContext(({ inventory, electricity }) => ({ inventory, electricity }))(
  ResourcesNav
);
