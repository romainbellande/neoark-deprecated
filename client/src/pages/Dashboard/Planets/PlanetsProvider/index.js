import { withApiContext } from '../../../../common/providers/ApiProvider';
import withWrapper from '../../../../common/helpers/with-wrapper';
import PlanetsProvider, { withPlanetsContext } from './PlanetsProvider';

export { withPlanetsContext };

const PlanetsProviderWrapper = withApiContext(({ client, token }) => ({ client, token }))(
  PlanetsProvider
);

export const withPlanetsProvider = withWrapper(PlanetsProviderWrapper);

export default PlanetsProviderWrapper;
