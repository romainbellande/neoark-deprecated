import { withApiContext } from '../ApiProvider';
import UserProvider, { withUserContext } from './UserProvider';

export { withUserContext };

export default withApiContext(
  ({ client, isLoggedIn }) => ({ client, isLoggedIn }),
  ({ setToken }) => ({
    setToken: token => {
      window.sessionStorage.setItem('token', token);
      setToken(token);
    },
  })
)(UserProvider);
