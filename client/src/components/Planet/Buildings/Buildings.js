import React from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AttachMoneyRoundedIcon from '@material-ui/icons/AttachMoneyRounded';
import HtmlTooltip from '../../HtmlTooltip';

function Buildings({ buildingConfigurations, buyProcessor, classes }) {
  const getUpgradeTooltipText = costs => (
    <div>
      {costs.map(({ id: costId, name, amount }) => (
        <div key={`cost-item-name-${costId}`}>
          {name}: {amount}
        </div>
      ))}
    </div>
  );

  return (
    <Grid container className={classes.root} spacing={2}>
      {buildingConfigurations.map(({ name, energyCost, costs }) => (
        <Grid item xs={3} key={`building-${name}`}>
          <Paper className={classes.paper}>
            <span>{name}</span>
            <HtmlTooltip
              title={getUpgradeTooltipText([
                { id: 3, name: 'Energy', amount: energyCost },
                ...costs,
              ])}
            >
              <Fab
                size="small"
                color="primary"
                aria-label="Buy"
                className={classes.margin}
                onClick={buyProcessor}
              >
                <AttachMoneyRoundedIcon className={classes.extendedIcon} />
              </Fab>
            </HtmlTooltip>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

Buildings.propTypes = {
  buyProcessor: func.isRequired,
  classes: shape({}).isRequired,
  buildingConfigurations: arrayOf(
    shape({
      id: number.isRequired,
      name: string.isRequired,
      levelMultiplier: number.isRequired,
      energyCost: number.isRequired,
      costs: arrayOf(
        shape({
          amount: number.isRequired,
          name: string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default Buildings;
