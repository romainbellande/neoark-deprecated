import React, { useEffect, useState } from 'react';
import { number, shape, arrayOf, string } from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import moment from 'moment';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/styles';

import useInterval from '../../../../common/helpers/use-interval';

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

const getRemainingTime = (totalMS, percent) => {
  const time = totalMS - percent / totalMS;
  return time;
};

function ProcessorRow({ id, recipe, level, ratio, resources, items, classes }) {
  let startPercents = 0;

  if (recipe.id >= 0 && resources[recipe.id] != null) {
    const amount = resources[recipe.id].value;
    startPercents = (amount - Math.floor(amount)) * 100;
  }

  let totalDurationInMS = (1 / recipe.speed) * 3600 * 1000;
  totalDurationInMS -= (startPercents / 100) * totalDurationInMS;

  const [remainingTime, setRemainingTime] = useState(totalDurationInMS);
  const [completed, setCompleted] = React.useState(startPercents);

  useInterval(() => {
    setRemainingTime(remainingTime - 1000);
  }, 1000);

  useEffect(() => {
    function progress() {
      setCompleted(oldCompleted => {
        if (oldCompleted === 100) {
          return 0;
        }
        const percent = oldCompleted + recipe.speed / 3600;
        // console.log('Math.min(oldCompleted + diff, 100)', Math.min(oldCompleted + diff, 100))
        return percent;
      });
    }

    const timer = setInterval(progress, 100);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const remainingTimeFormatted = moment(remainingTime).format('mm:ss');

  const getUpgradeTooltipText = () => (
    <div>
      <div>metal: 10</div>
      <div>deuterium: 30</div>
    </div>
  );

  const getRecipeTooltipText = (recipe) => (
    <div style={{ display: 'flex' }}>
      <span>
        {recipe.input.map(item => (
          <div>{items[item.id].name}: {item.amount}</div>
        ))}
      </span>
      <span>
        {recipe.output.map(item => (
          <div>{items[item.id].name}: {item.amount}</div>
        ))}
      </span>
    </div>
  );

  return (
    <>
      <TableRow key={id}>
        <TableCell component="th" scope="row">
          {level}
        </TableCell>
        <TableCell align="right">
          <HtmlTooltip title={getRecipeTooltipText(recipe)}>
            <span>
              {recipe.name}
            </span>
          </HtmlTooltip>
        </TableCell>
        <TableCell align="right">
          {(recipe.speed * ratio).toFixed(2)}/h ({recipe.speed})
        </TableCell>
        <TableCell align="right">{(ratio * 100).toFixed(2)}%</TableCell>
        <TableCell align="right">
          <HtmlTooltip title={getUpgradeTooltipText()}>
            <Fab size="small" color="primary" aria-label="Add" className={classes.margin}>
              <NavigationIcon className={classes.extendedIcon} />
            </Fab>
          </HtmlTooltip>
        </TableCell>
      </TableRow>
    </>
  );
}

ProcessorRow.propTypes = {
  classes: shape({}).isRequired,
  id: number.isRequired,
  level: number.isRequired,
  ratio: number.isRequired,
  recipe: shape({
    id: number.isRequired,
    name: string.isRequired,
    speed: number.isRequired,
    input: arrayOf(
      shape({
        id: number.isRequired,
        amount: number.isRequired,
      })
    ).isRequired,
    output: arrayOf(
      shape({
        id: number.isRequired,
        amount: number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ProcessorRow;
