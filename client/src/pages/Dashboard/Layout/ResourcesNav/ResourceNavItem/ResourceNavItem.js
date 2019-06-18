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
          {name}: {netAmount}
        </div>
        <div className={classes.production}>
          <span className={classes.productionItem}>
            <KeyboardArrowUpIcon /> {produced}
          </span>
          <span className={classes.productionItem}>
            <KeyboardArrowDownIcon /> {consumed}
          </span>
        </div>
      </ListItemText>
    </ListItem>
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
