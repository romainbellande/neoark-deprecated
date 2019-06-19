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
        <div className={classes.production}>
          {name}:
          <span style={{ marginLeft: '3px' }}>{netAmount}</span>
          <div className={classes.productionItem}>
            ({consumed > 0
              ? (<span style={{ color: 'green' }}>  +{consumed}</span>)
              : (<span style={{ color: 'red' }}> {consumed}</span>)
              // ? (<span style={{ color: 'green' }}> <KeyboardArrowUpIcon /> +{consumed}</span>)
              // : (<span style={{ color: 'red' }}><KeyboardArrowDownIcon /> {consumed}</span>)
            }/h)</div>
          {/* {consumed <= 0
            ?
            (<span>
              ({produced > 0
                ? (<span style={{ color: 'green' }}> +{produced}</span>)
                : (<span style={{ color: 'red' }}> {produced}</span>)
              })
              </span>)
              : (<span></span>)
            } */}
          {/* </span> */}
        </div>
      </ListItemText >
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
