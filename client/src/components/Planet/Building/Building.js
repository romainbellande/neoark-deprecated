import React from 'react';
import Typography from '@material-ui/core/Typography';
import { string, number } from 'prop-types';

const Building = ({ name, level, productionByHour }) => {
  return (
    <div>
      <Typography>
        {name} | level {level}
      </Typography>
      <div>
        <div>
          <span>prod/h:</span>
          <span>{productionByHour}/h</span>
        </div>
      </div>
    </div>
  );
};

Building.propTypes = {
  name: string.isRequired,
  level: number.isRequired,
  productionByHour: number.isRequired,
};

export default Building;
