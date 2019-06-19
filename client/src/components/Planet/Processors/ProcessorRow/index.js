import _ from 'lodash';
import { withStyles } from '@material-ui/styles';

import ProcessorRow from './ProcessorRow';
import styles from './styles';
import { withPlanetContext } from '../../../../common/providers/PlanetProvider';

export default _.flow([
  withPlanetContext(null, ({ upgradeProcessor, fetchCurrentPlanet, changeProcessorRecipe }) => ({
    onUpgrade: upgradeProcessor,
    fetchCurrentPlanet,
    onRecipeChange: changeProcessorRecipe,
  })),
  withStyles(styles),
])(ProcessorRow);
