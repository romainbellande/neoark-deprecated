import React from 'react';
import { arrayOf, shape } from 'prop-types';
import { Redirect, Switch } from 'react-router-dom';

import RouteWithSubRoutes from '../../components/RouteWithSubRoutes';

function Portal({ routes }) {
  return (
    <div>
      <Switch>
        {routes.map(({ slug, ...route }) => (
          <RouteWithSubRoutes key={`route-${slug}`} {...route} />
        ))}
        <Redirect from="/portal" to="/portal/login" exact />
      </Switch>
    </div>
  );
}

Portal.propTypes = {
  routes: arrayOf(shape({})).isRequired,
};

export default Portal;
