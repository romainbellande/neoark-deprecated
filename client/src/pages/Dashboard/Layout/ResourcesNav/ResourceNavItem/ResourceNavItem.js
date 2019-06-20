import React, { useState } from 'react';
import { shape, number, string, func } from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ProgressBar from '../../../../../components/ProgressBar';

function ResourceNavItem({
  id,
  name,
  netAmount,
  classes,
  getDurationInMs,
  getRemainingTimeInMs,
  isResourceProductionPaused,
  getProductionByHour,
}) {
  let duration;
  let end;
  const [amount, setAmount] = useState(netAmount);

  if (id !== 3) {
    duration = getDurationInMs(id);
    end = new Date().getTime() + getRemainingTimeInMs(id);
  }

  const onProgressComplete = () => {
    setAmount(prevValue => prevValue + 1);
  };

  return (
    <ListItem className={classes.categoryHeader}>
      <ListItemText
        classes={{
          primary: classes.categoryHeaderPrimary,
        }}
      >
        <div className={classes.production}>
          {name}:<span style={{ marginLeft: '3px' }}>{Math.ceil(amount)}</span>
          <div className={classes.productionItem}>
            (
            {getProductionByHour(id) > 0 ? (
              <span style={{ color: 'green' }}> +{Math.floor(getProductionByHour(id))}</span>
            ) : (
              <span style={{ color: 'red' }}> {Math.floor(getProductionByHour(id))}</span>
            )}
            /h)
          </div>
        </div>
        {id !== 3 && (
          <ProgressBar
            end={end}
            duration={duration}
            onComplete={onProgressComplete}
            loop
            pause={isResourceProductionPaused(id)}
          />
        )}
      </ListItemText>
    </ListItem>
  );
}

ResourceNavItem.propTypes = {
  id: number.isRequired,
  classes: shape({}).isRequired,
  name: string.isRequired,
  netAmount: number,
  getDurationInMs: func.isRequired,
  getRemainingTimeInMs: func.isRequired,
  isResourceProductionPaused: func.isRequired,
  getProductionByHour: func.isRequired,
};

ResourceNavItem.defaultProps = {
  netAmount: null,
};

export default ResourceNavItem;
