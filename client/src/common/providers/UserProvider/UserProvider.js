import React, { createContext, useState } from 'react';
import { func, node } from 'prop-types';

import withContextFactory from '../../helpers/with-context-factory';

export const UserContext = createContext();
export const withUserContext = withContextFactory(UserContext);

function UserProvider({ client, children, setToken }) {
  const [user, setUser] = useState(null);

  const register = async ({ username, password, email }) => {
    const { data } = await client.post('/players/register', { username, password, email });
    setUser(data);
    console.log('data', data);
  };

  const fetchUser = async () => {
    const { data } = await client.get('/players/me');
    return data;
  };

  const login = async ({ email, password }) => {
    const {
      data: { token: newToken },
    } = await client.post('/players/login', { email, password });
    const userData = await fetchUser();
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    state: {
      user,
    },
    dispatch: {
      register,
      login,
      logout,
    },
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

UserProvider.propTypes = {
  client: func.isRequired,
  children: node.isRequired,
  setToken: func.isRequired,
};

export default UserProvider;
