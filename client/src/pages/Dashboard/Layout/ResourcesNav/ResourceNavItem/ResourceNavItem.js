import React from 'react';
import { shape, number, string } from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function ResourceNavItem({ name, consumed, netAmount, classes }) {
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
      </ListItemText>
    </ListItem>
  );
}

ResourceNavItem.propTypes = {
  classes: shape({}).isRequired,
  name: string.isRequired,
  consumed: number.isRequired,
  netAmount: number,
};

ResourceNavItem.defaultProps = {
  netAmount: null,
};

export default ResourceNavItem;
