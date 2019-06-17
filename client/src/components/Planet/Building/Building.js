import React from 'react';
import { string, number, shape, func } from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const Building = ({ name, level, productionByHour, classes, onUpgrade }) => {
  return (
    <div className={classes.root}>
      <Typography variant="h4">
        {name} | level {level}
      </Typography>
      <div>
        <div>
          <span>prod/h:</span>
          <span>{productionByHour}/h</span>
        </div>
        <div className={classes.actions}>
          <Button variant="contained" color="primary" onClick={onUpgrade}>
            Upgrade
          </Button>
        </div>
      </div>
    </div>
  );
};

Building.propTypes = {
  name: string.isRequired,
  level: number.isRequired,
  productionByHour: number.isRequired,
  classes: shape({}).isRequired,
  onUpgrade: func.isRequired,
};

export default Building;
