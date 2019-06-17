import Building from './Building';
import { withPlanetContext } from '../PlanetProvider';
import {
  getCurrentBuildingConfiguration,
  getCurrentBuildingLevel,
} from '../PlanetProvider/selectors';

export default withPlanetContext(state => {
  const buildingConfiguration = getCurrentBuildingConfiguration(state);
  const { name } = buildingConfiguration;
  const { level } = getCurrentBuildingLevel(state);
  const productionByHour = level;

  return {
    level,
    name,
    productionByHour,
  };
})(Building);
