import React from 'react';
import { Redirect } from 'react-router-dom';
import { shape } from 'prop-types';

import Paperbase from './Layout';

const Dashboard = ({ user }) => {
  return user ? <Paperbase /> : <Redirect to="/portal/login" />;
};

Dashboard.propTypes = {
  user: shape({}),
};

Dashboard.defaultProps = {
  user: null,
};

export default Dashboard;
