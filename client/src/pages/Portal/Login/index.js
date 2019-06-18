import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import { withUserContext } from '../../../common/providers/UserProvider';
import { withApiContext } from '../../../common/providers/ApiProvider';
import Login from './Login';
import styles from './styles';

export default _.flow([
  withStyles(styles),
  withRouter,
  withApiContext(({ token }) => ({ token })),
  withUserContext(({ user }) => ({ user }), ({ login }) => ({ onSubmit: login })),
])(Login);
