import { withApiContext } from '../ApiProvider';
import withWrapper from '../../helpers/with-wrapper';
import PlanetsProvider, { withPlanetsContext } from './PlanetsProvider';

export { withPlanetsContext };

const PlanetsProviderWrapper = withApiContext(({ client, token }) => ({ client, token }))(
  PlanetsProvider
);

export const withPlanetsProvider = withWrapper(PlanetsProviderWrapper);

export default PlanetsProviderWrapper;
