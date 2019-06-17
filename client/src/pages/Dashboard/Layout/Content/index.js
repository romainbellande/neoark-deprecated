import React from 'react';
import { shape } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Route } from 'react-router-dom';

import routes from '../../routes';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
});

const Content = ({ classes }) => {
  return (
    <div className={classes.root}>
      {routes.map(({ slug, ...route }) => (
        <Route key={`route-${slug}`} {...route} />
      ))}
    </div>
  );
};

Content.propTypes = {
  classes: shape({}).isRequired,
};

export default withStyles(styles)(Content);
