import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { shape } from 'prop-types';

import useInterval from '../../helpers/use-interval';

const styles = theme => ({
  root: {
    display: 'flex',
    background: '#232f3e',
    padding: '10px 10px',
  },
  item: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    textAlign: 'justify',
    alignItems: 'center',
    width: '100px',
  },
  value: {
    background: theme.palette.common.white,
    color: theme.palette.primary.dark,
    padding: '5px',
    width: '60px',
    'text-align': 'right',
    fontSize: '12px',
  },
});

const ResourcesBar = ({ classes }) => {
  const [ironValue, setIronValue] = useState(1500120);

  useInterval(() => {
    setIronValue(ironValue + 1);
  }, 1000);

  return (
    <div className={classes.root}>
      <span className={classes.item}>
        iron: <span className={classes.value}>{ironValue}</span>
      </span>
    </div>
  );
};

ResourcesBar.propTypes = {
  classes: shape({}).isRequired,
};

export default withStyles(styles)(ResourcesBar);
