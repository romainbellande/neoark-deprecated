import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { withUserContext } from '../../../common/providers/UserProvider';

import Register from './Register';

export default _.flow([
  withUserContext(({ user }) => ({ user }), ({ register }) => ({ onSubmit: register })),
  withRouter,
])(Register);
