import React, { useState, useEffect } from 'react';
import { number, shape, arrayOf, string, func } from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/styles';
import moment from 'moment';

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

function ProcessorRow({
  id,
  recipe,
  level,
  ratio,
  items,
  classes,
  upgradeCosts,
  onUpgrade,
  upgradeFinish,
  fetchCurrentPlanet,
}) {
  const [updateRemainingTime, setUpdateRemainingTime] = useState(null);
  const intervalTime = 200;

  useEffect(() => {
    const progress = () => {
      if (upgradeFinish !== null) {
        setUpdateRemainingTime(prevValue => {
          if (prevValue === null) {
            return upgradeFinish - new Date().getTime();
          }

          if (prevValue <= 0) {
            fetchCurrentPlanet();
            return 0;
          }

          return prevValue - intervalTime;
        });
      }
    };

    const timer = setInterval(progress, intervalTime);

    return () => {
      clearInterval(timer);
    };
  }, [upgradeFinish]);

  const getUpgradeTooltipText = () => (
    <div>
      {upgradeCosts.map(({ id: costId, name, amount }) => (
        <div key={`cost-item-name-${costId}`}>
          {name}: {amount}
        </div>
      ))}
    </div>
  );

  const getRecipeTooltipText = myRecipe => (
    <div style={{ display: 'flex' }}>
      <span>
        {myRecipe.input.map(item => (
          <div key={`input-${item.id}`}>
            {items[item.id].name}: {item.amount}
          </div>
        ))}
      </span>
      <span>
        {myRecipe.output.map(item => (
          <div key={`output-${item.id}`}>
            {items[item.id].name}: {item.amount}
          </div>
        ))}
      </span>
    </div>
  );

  const onProcessorUpgrade = () => onUpgrade(id);

  return (
    <>
      <TableRow key={id}>
        <TableCell component="th" scope="row">
          {level}
        </TableCell>
        <TableCell align="right">
          <HtmlTooltip title={getRecipeTooltipText(recipe)}>
            <span>{recipe.name}</span>
          </HtmlTooltip>
        </TableCell>
        <TableCell align="right">
          {(recipe.speed * ratio).toFixed(2)}/h ({recipe.speed})
        </TableCell>
        <TableCell align="right">{(ratio * 100).toFixed(2)}%</TableCell>
        <TableCell align="right">
          {!!updateRemainingTime && upgradeFinish ? (
            <div>{moment(updateRemainingTime, 'x').format('mm:ss')}</div>
          ) : (
            <HtmlTooltip title={getUpgradeTooltipText()}>
              <Fab
                size="small"
                color="primary"
                aria-label="Add"
                className={classes.margin}
                onClick={onProcessorUpgrade}
              >
                <NavigationIcon className={classes.extendedIcon} />
              </Fab>
            </HtmlTooltip>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}

ProcessorRow.propTypes = {
  items: arrayOf(shape({})).isRequired,
  fetchCurrentPlanet: func.isRequired,
  upgradeFinish: func,
  onUpgrade: func.isRequired,
  upgradeCosts: arrayOf(
    shape({
      id: number.isRequired,
      name: string.isRequired,
      amount: number.isRequired,
    })
  ).isRequired,
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

ProcessorRow.defaultProps = {
  upgradeFinish: null,
};

export default ProcessorRow;
