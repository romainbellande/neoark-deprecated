import React from 'react';
import { shape, number, string } from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

function ResourceNavItem({ name, consumed, produced, currentPercent, netAmount, classes }) {
  return (
    <ListItem className={classes.categoryHeader}>
      <ListItemText
        classes={{
          primary: classes.categoryHeaderPrimary,
        }}
      >
        <div>
          <b>{name}: {netAmount}</b>
        </div>
        <div class="small" className={classes.production}>
          <div className={classes.productionItem}>
            Produces
            {consumed > 0
              ? (<span style={{ color: 'green' }}> <KeyboardArrowUpIcon /> {consumed}</span>)
              : (<span style={{ color: 'red' }}><KeyboardArrowDownIcon /> {consumed}</span>)
            }
          </div>
        </div>
        <div className={classes.production}>
          <div className={classes.productionItem}>
            Demand
            {produced > 0
              ? (<span style={{ color: 'green' }}> <KeyboardArrowUpIcon /> {produced}</span>)
              : (<span style={{ color: 'red' }}><KeyboardArrowDownIcon /> {produced}</span>)
            }
          </div>
        </div>
      </ListItemText>
    </ListItem >
  );
}

ResourceNavItem.propTypes = {
  classes: shape({}).isRequired,
  name: string.isRequired,
  produced: number.isRequired,
  consumed: number.isRequired,
  currentPercent: number.isRequired,
  netAmount: number,
};

ResourceNavItem.defaultProps = {
  netAmount: null,
};

export default ResourceNavItem;
