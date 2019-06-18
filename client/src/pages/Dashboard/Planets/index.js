import _ from 'lodash';
import { withStyles } from '@material-ui/core';

import { withPlanetsContext } from '../../../common/providers/PlanetsProvider';
import Planets from './Planets';
import styles from './styles';

export default _.flow([
  withStyles(styles),
  withPlanetsContext(({ planets }) => ({ planets }), ({ fetchPlanets }) => ({ fetchPlanets })),
])(Planets);
