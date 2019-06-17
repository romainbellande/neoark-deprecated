import Dashboard from './Dashboard';
import { withUserContext } from '../../common/providers/UserProvider';

export default withUserContext(({ user }) => ({ user }))(Dashboard);
