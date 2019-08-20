import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import './App.css';
import routes from './routes';
import RouteWithSubRoutes from './components/RouteWithSubRoutes';
import ApiProvider from './common/providers/ApiProvider';
import UserProvider from './common/providers/UserProvider';
// import { greet } from "neoark-lib";
// import init, { add } from './pkg/neoark_lib.js';
// const rust = import('./pkg/neoark_lib')

function App() {
  // async function run() {
  //   await init();
  // }
  // run()
  // rust
  //   .then(m => m.greet('World!'))
  //   .catch(console.error);

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
