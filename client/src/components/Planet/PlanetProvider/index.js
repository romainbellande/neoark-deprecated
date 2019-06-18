import PlanetProvider, { withPlanetContext } from './PlanetProvider';
import { withApiContext } from '../../../common/providers/ApiProvider';

export { withPlanetContext };
export default withApiContext(({ client }) => ({ client }))(PlanetProvider);
