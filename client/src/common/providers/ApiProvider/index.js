import React, { createContext, useEffect, useState } from 'react';
import { node } from 'prop-types';
import axios from 'axios';

import withContextFactory from '../../helpers/with-context-factory';

export const ApiContext = createContext();
export const withApiContext = withContextFactory(ApiContext);

const createClient = (options = {}) => axios.create({ baseURL: '/api/v1', ...options });

const ApiProvider = ({ children }) => {
  const defaultClient = createClient();
  const [clientWrapper, setClientWrapper] = useState({ client: defaultClient });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { client } = clientWrapper;
  const setClient = value => setClientWrapper({ client: value });

  const sessionToken = window.sessionStorage.getItem('token');
  const [token, setToken] = useState(sessionToken);

  useEffect(() => {
    if (token != null) {
      const authClient = createClient({
        headers: { authentication: token },
      });
      setClient(authClient);
      setIsLoggedIn(true);
    } else if (sessionToken) {
      setToken(sessionToken);
    } else {
      setClient(defaultClient);
    }
  }, [token]);

  const value = {
    state: {
      client,
      token,
      isLoggedIn,
    },
    dispatch: {
      setToken,
    },
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

ApiProvider.propTypes = {
  children: node.isRequired,
};

export default ApiProvider;
