import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { shape } from 'prop-types';

import useInterval from '../../../common/helpers/use-interval';
import styles from './styles';

const ResourcesBar = ({ classes }) => {
  const [ironValue, setIronValue] = useState(1500120);
  const [copperValue, setCopperValue] = useState(12312);
  const ironSpeed = 1000;
  const copperSpeed = 243;

  useInterval(() => {
    setIronValue(ironValue + 1);
  }, ironSpeed);

  useInterval(() => {
    setCopperValue(copperValue + 1);
  }, copperSpeed);

  return (
    <div className={classes.root}>
      <span className={classes.item}>
        <span className={classes.label}>iron:</span>
        <span className={classes.value}>{ironValue}</span>
      </span>
      <span className={classes.item}>
        <span className={classes.label}>copper:</span>
        <span className={classes.value}>{copperValue}</span>
      </span>
    </div>
  );
};

ResourcesBar.propTypes = {
  classes: shape({}).isRequired,
};

export default withStyles(styles)(ResourcesBar);
