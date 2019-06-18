import React, { createContext, useState, useEffect } from 'react';
import { func, node, bool } from 'prop-types';

import withContextFactory from '../../helpers/with-context-factory';

export const UserContext = createContext();
export const withUserContext = withContextFactory(UserContext);

function UserProvider({ client, children, setToken, isLoggedIn }) {
  const [user, setUser] = useState(null);

  const fetchUser = async (options = {}) => {
    const { data } = await client.get('/players/me', options);
    setUser(data);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUser();
    }
  }, [isLoggedIn]);

  const register = async ({ username, password, email }) => {
    const { data } = await client.post('/players/register', { username, password, email });
    setUser(data);
  };

  const login = async ({ email, password }) => {
    const {
      data: { token: newToken },
    } = await client.post('/players/login', { email, password });
    setToken(newToken);
    await fetchUser({ headers: { authentication: newToken } });
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
  isLoggedIn: bool.isRequired,
  client: func.isRequired,
  children: node.isRequired,
  setToken: func.isRequired,
};

export default UserProvider;
