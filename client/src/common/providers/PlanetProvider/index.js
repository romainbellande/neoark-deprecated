import PlanetProvider, { withPlanetContext } from './PlanetProvider';
import { withApiContext } from '../ApiProvider';

export { withPlanetContext };
export default withApiContext(({ client }) => ({ client }))(PlanetProvider);
