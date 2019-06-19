import React, { useState, useEffect } from 'react';
import { number, shape, arrayOf, string, func } from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import moment from 'moment';
import classNames from 'classnames';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FilledInput from '@material-ui/core/FilledInput';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';

import HtmlTooltip from '../../../HtmlTooltip';
import recipes from '../../../../common/mocks/recipes';

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
  onRecipeChange,
  getElectricityConsumption,
  getMaxElectricityConsumption,
  getGeneratorProduction,
}) {
  const [updateRemainingTime, setUpdateRemainingTime] = useState(null);
  const [newRecipe, setNewRecipe] = useState('');
  const [open, setOpen] = useState(false);
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
          {name}: {amount * level}
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

  const getIORecipe = ({ myRecipe, isOutput = true, isElectricityGenerator = false }) =>
    myRecipe.map(({ id: currentRecipeId, amount }) => {
      const { name, speed } = recipes.find(({ id: recipeId }) => recipeId === currentRecipeId);
      const rawRatio = speed * level * level ** 1.1 * amount;
      const productionPerHour = (isElectricityGenerator ? rawRatio : rawRatio * ratio).toFixed(2);
      return (
        <TableRow key={`infos-output-${id}`}>
          <TableCell>{name}:</TableCell>
          <TableCell align="right">{isElectricityGenerator ? '/' : amount}</TableCell>
          <TableCell align="right">
            <span className={isOutput ? classes.recipeInput : classes.recipeOutput}>
              {isOutput > 0 ? '+' : '-'}
              {productionPerHour}
            </span>
            /h ({rawRatio.toFixed(2)})
          </TableCell>
          <TableCell>{((100 * productionPerHour) / rawRatio).toFixed(2)}%</TableCell>
        </TableRow>
      );
    });

  const isElectricityGenerator = recipe && recipe.id === 3;
  const displayElectricityConsumptionPercent = () =>
    `~ ${getElectricityConsumption(id)}/${getMaxElectricityConsumption(id)}`;

  return recipe ? (
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
        <TableCell align="right">{(ratio * 100).toFixed(2)}%</TableCell>
        <TableCell align="right">
          {!isElectricityGenerator
            ? displayElectricityConsumptionPercent()
            : getGeneratorProduction(id)}
        </TableCell>
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
                <KeyboardArrowUpIcon className={classes.extendedIcon} />
              </Fab>
            </HtmlTooltip>
          )}
        </TableCell>
        <TableCell>
          <IconButton
            color="secondary"
            // className={clsx(classes.expand, {
            //   [classes.expandOpen]: expanded,
            // })}
            onClick={() => setOpen(prev => !prev)}
            // aria-expanded={expanded}
            aria-label="Show more"
          >
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className={classNames({ [classes.rowClosed]: !open })}>
        <TableCell colSpan={6} padding="none">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className={classes.infos}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Actual Prod/Hour (Max)</TableCell>
                    <TableCell align="right">Efficiency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getIORecipe({ myRecipe: recipe.input }) &&
                    getIORecipe({
                      myRecipe: isElectricityGenerator
                        ? [{ id: recipe.id, amount: recipe.speed }]
                        : recipe.output,
                      isElectricityGenerator,
                      isOutput: true,
                    })}
                </TableBody>
              </Table>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  ) : (
    <TableRow>
      <TableCell component="th" scope="row">
        {level}
      </TableCell>
      <TableCell colSpan={1} align="right">
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="filled-recipe-native-simple">Recipe</InputLabel>
          <Select
            native
            classes={{ select: classes.select }}
            value={newRecipe}
            onChange={e => setNewRecipe(e.target.value)}
            input={<FilledInput name="Recipe" id="filled-recipe-native-simple" />}
          >
            <option value={null} />
            {recipes.map(({ id: recipeId, name }) => (
              <option value={recipeId}>{name}</option>
            ))}
          </Select>
        </FormControl>
      </TableCell>
      <TableCell align="right">/</TableCell>
      <TableCell align="right">/</TableCell>
      <TableCell align="right">
        {!!updateRemainingTime && upgradeFinish ? (
          <div>{moment(updateRemainingTime, 'x').format('mm:ss')}</div>
        ) : (
          <Fab
            size="small"
            color="primary"
            aria-label="Add"
            className={classes.margin}
            disabled={newRecipe === ''}
            onClick={() => onRecipeChange(id, newRecipe)}
          >
            <KeyboardArrowUpIcon className={classes.extendedIcon} />
          </Fab>
        )}
      </TableCell>
      <TableCell align="right">/</TableCell>
    </TableRow>
  );
}

ProcessorRow.propTypes = {
  getMaxElectricityConsumption: func.isRequired,
  getElectricityConsumption: func.isRequired,
  getGeneratorProduction: func.isRequired,
  onRecipeChange: func.isRequired,
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
