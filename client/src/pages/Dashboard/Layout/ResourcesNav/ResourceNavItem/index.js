import _ from 'lodash';
import { withStyles } from '@material-ui/styles';

import ResourceNavItem from './ResourceNavItem';
import styles from './styles';
import { withPlanetContext } from '../../../../../common/providers/PlanetProvider/PlanetProvider';

export default _.flow([
  withPlanetContext(
    null,
    ({
      getInventoryItemDurationInMs,
      getInventoryItemRemainingTimeInMs,
      isResourceProductionPaused,
      getProcessorsProductionByRecipeId,
    }) => ({
      getDurationInMs: getInventoryItemDurationInMs,
      getRemainingTimeInMs: getInventoryItemRemainingTimeInMs,
      isResourceProductionPaused,
      getProductionByHour: getProcessorsProductionByRecipeId,
    })
  ),
  withStyles(styles),
])(ResourceNavItem);
