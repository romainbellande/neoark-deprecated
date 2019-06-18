import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';

import Building from './Building';
import styles from './styles';
import { withPlanetContext } from '../PlanetProvider';
import {
  getCurrentBuildingConfiguration,
  getCurrentBuildingLevel,
} from '../PlanetProvider/selectors';

export default _.flow([
  withStyles(styles),
  withPlanetContext(state => {
    const buildingConfiguration = getCurrentBuildingConfiguration(state);
    const { name } = buildingConfiguration;
    const { level } = getCurrentBuildingLevel(state);
    const productionByHour = level;

    return {
      level,
      name,
      productionByHour,
    };
  }),
])(Building);
