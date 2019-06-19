import React from 'react';
import { shape, number, string, func } from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ProgressBar from '../../../../../components/ProgressBar';

function ResourceNavItem({
  id,
  name,
  consumed,
  netAmount,
  classes,
  getDurationInMs,
  getRemainingTimeInMs,
}) {
  let duration;
  let end;

  if (id !== 3) {
    duration = getDurationInMs(id);
    end = new Date().getTime() + getRemainingTimeInMs(id);
  }

  return (
    <ListItem className={classes.categoryHeader}>
      <ListItemText
        classes={{
          primary: classes.categoryHeaderPrimary,
        }}
      >
        <div className={classes.production}>
          {name}:<span style={{ marginLeft: '3px' }}>{netAmount}</span>
          <div className={classes.productionItem}>
            (
            {consumed > 0 ? (
              <span style={{ color: 'green' }}> +{consumed}</span>
            ) : (
              <span style={{ color: 'red' }}> {consumed}</span>
            )}
            /h)
          </div>
        </div>
        {id !== 3 && <ProgressBar end={end} duration={duration} onComplete={() => {}} loop />}
      </ListItemText>
    </ListItem>
  );
}

ResourceNavItem.propTypes = {
  id: number.isRequired,
  classes: shape({}).isRequired,
  name: string.isRequired,
  consumed: number.isRequired,
  netAmount: number,
  getDurationInMs: func.isRequired,
  getRemainingTimeInMs: func.isRequired,
};

ResourceNavItem.defaultProps = {
  netAmount: null,
};

export default ResourceNavItem;
