import _ from 'lodash';
import { withStyles } from '@material-ui/styles';

import Buildings from './Buildings';
import { withPlanetContext } from '../../../common/providers/PlanetProvider/PlanetProvider';
import styles from './styles';

export default _.flow([
  withStyles(styles),
  withPlanetContext(
    ({ buildingConfigurations }) => ({ buildingConfigurations }),
    ({ buyProcessor }) => ({ buyProcessor })
  ),
])(Buildings);
