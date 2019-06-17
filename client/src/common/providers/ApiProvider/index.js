import React, { createContext, useEffect, useState } from 'react';
import { node } from 'prop-types';
import axios from 'axios';

import withContextFactory from '../../helpers/with-context-factory';

export const ApiContext = createContext();
export const withApiContext = withContextFactory(ApiContext);

const ApiProvider = ({ children }) => {
  const client = axios.create({ baseURL: '/api/v1' });
  const [token, setToken] = useState(null);

  useEffect(() => {
    return () => {
      client.defaults.headers.common.authentication = token;
    };
  }, [token, client.defaults.headers.common.authentication]);

  const value = {
    state: {
      client,
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
