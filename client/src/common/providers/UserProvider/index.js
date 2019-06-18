import { withApiContext } from '../ApiProvider';
import UserProvider, { withUserContext } from './UserProvider';

export { withUserContext };

export default withApiContext(({ client }) => ({ client }), ({ setToken }) => ({ setToken }))(
  UserProvider
);
