import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import './App.css';
import routes from './routes';
import RouteWithSubRoutes from './components/RouteWithSubRoutes';
import ApiProvider from './common/providers/ApiProvider';
import UserProvider from './common/providers/UserProvider';
// import { greet } from "neoark-lib";
const { greet } = import('./pkg/neoark_lib')

function App() {
  async function run() {
    // // First up we need to actually load the wasm file, so we use the
    // // default export to inform it where the wasm file is located on the
    // // server, and then we wait on the returned promise to wait for the
    // // wasm to be loaded.
    // // It may look like this: `await init('./pkg/without_a_bundler_bg.wasm');`,
    // // but there is also a handy default inside `init` function, which uses
    // // `import.meta` to locate the wasm file relatively to js file
    // //
    // // Note that instead of a string here you can also pass in an instance
    // // of `WebAssembly.Module` which allows you to compile your own module.
    // // Also note that the promise, when resolved, yields the wasm module's
    // // exports which is the same as importing the `*_bg` module in other
    // // modes
    // await init();

    // // And afterwards we can use all the functionality defined in wasm.
    // const result = add(1, 2);
    // console.log(`1 + 2 = ${result}`);
    // if (result !== 3)
    //   throw new Error("wasm addition doesn't work!");
    greet('lo')
  }

  run();
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
