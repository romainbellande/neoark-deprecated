import React, { useEffect, useState } from 'react';
import { number, shape, arrayOf, string } from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment';

import useInterval from '../../../../common/helpers/use-interval';

const getRemainingTime = (totalMS, percent) => {
  const time = totalMS - percent / totalMS;
  console.log('totalMS', totalMS);
  console.log('percent', percent);
  console.log('time', time);
  return time;
};

function ProcessorRow({ id, recipe, level, ratio, resources, classes }) {
  let start_percents = 0;


  if (recipe.id >= 0 && resources[recipe.id] != null) {
    const amount = resources[recipe.id].value;
    start_percents = (amount - Math.floor(amount)) * 100;
  }

  let totalDurationInMS = (1 / recipe.speed) * 3600 * 1000;
  totalDurationInMS -= (start_percents / 100) * totalDurationInMS;

  const [remainingTime, setRemainingTime] = useState(totalDurationInMS);
  const [completed, setCompleted] = React.useState(start_percents);

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

  return (
    <>
      <TableRow key={id}>
        <TableCell component="th" scope="row">{level}</TableCell>
        <TableCell align="right">
          {recipe.name}
        </TableCell>
        <TableCell align="right">{(recipe.speed * ratio).toFixed(2)}/h ({recipe.speed})</TableCell>
        <TableCell align="right">{(ratio * 100).toFixed(2)}%</TableCell>
        <TableCell align="right">
          <Fab size="small" color="primary" aria-label="Add" className={classes.margin}>
            <NavigationIcon className={classes.extendedIcon} />
          </Fab>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4}>
          <LinearProgress variant="determinate" value={completed} />
        </TableCell>
        <TableCell colSpan={1}>
          {remainingTimeFormatted} ({completed.toFixed(2)}%)
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
