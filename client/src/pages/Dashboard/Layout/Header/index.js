import Header from './Header';
import { withPlanetContext } from '../../../../common/providers/PlanetProvider';

export default withPlanetContext(({ planet }) => ({ planetName: planet ? planet.name : null }))(
  Header
);
