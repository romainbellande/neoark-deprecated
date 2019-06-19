import _ from 'lodash';
import { withStyles } from '@material-ui/styles';

import ResourceNavItem from './ResourceNavItem';
import styles from './styles';
import { withPlanetContext } from '../../../../../common/providers/PlanetProvider/PlanetProvider';

export default _.flow([
  withPlanetContext(
    null,
    ({
      getInventoryItemInitialProgress,
      getProcessorsProductionByRecipeId,
      getInventoryItemDurationInMs,
      getInventoryItemRemainingTimeInMs,
    }) => ({
      currentProgress: getInventoryItemInitialProgress,
      productionPerHour: getProcessorsProductionByRecipeId,
      getDurationInMs: getInventoryItemDurationInMs,
      getRemainingTimeInMs: getInventoryItemRemainingTimeInMs,
    })
  ),
  withStyles(styles),
])(ResourceNavItem);
