import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import './App.css';
import routes from './routes';
import RouteWithSubRoutes from './components/RouteWithSubRoutes';
import ApiProvider from './common/providers/ApiProvider';
import UserProvider from './common/providers/UserProvider';

function App() {
  return (
    <ApiProvider>
      <UserProvider>
        <Router basename="#">
          <Switch>
            {routes.map(({ slug, ...route }) => (
              <RouteWithSubRoutes key={`route-${slug}`} {...route} />
            ))}
          </Switch>
        </Router>
      </UserProvider>
    </ApiProvider>
  );
}

export default App;
