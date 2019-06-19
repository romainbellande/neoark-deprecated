import React, { useState } from 'react';
import { number, shape, arrayOf, string, func } from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import AppSelect from '../../../AppSelect';

import HtmlTooltip from '../../../HtmlTooltip';
import recipes from '../../../../common/mocks/recipes';
import ProcessorProgress from '../ProcessorProgress';

function ProcessorRow({
  id,
  recipe,
  level,
  ratio,
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
  const [newRecipe, setNewRecipe] = useState(recipe ? recipe.id : '');
  const [open, setOpen] = useState(false);
  const isUpgrading = () => upgradeFinish;

  const getUpgradeTooltipText = () => (
    <div>
      {upgradeCosts.map(({ id: costId, name, amount }) => (
        <div key={`cost-item-name-${costId}`}>
          {name}: {amount * level}
        </div>
      ))}
    </div>
  );

  const onProductRecipeChange = e => {
    const myNewRecipe = e.target.value;
    setNewRecipe(myNewRecipe);
    onRecipeChange(id, myNewRecipe);
  };

  // const getRecipeTooltipText = myRecipe => (
  //   <div style={{ display: 'flex' }}>
  //     <span>
  //       {myRecipe.input.map(item => (
  //         <div key={`input-${item.id}`}>
  //           {items[item.id].name}: {item.amount}
  //         </div>
  //       ))}
  //     </span>
  //     <span>
  //       {myRecipe.output.map(item => (
  //         <div key={`output-${item.id}`}>
  //           {items[item.id].name}: {item.amount}
  //         </div>
  //       ))}
  //     </span>
  //   </div>
  // );

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

  const recipeToOption = ({ id: value, name }) => ({ value, name });

  const renderSelect = () => {
    if (!isUpgrading()) {
      return (
        <AppSelect
          value={newRecipe}
          onChange={onProductRecipeChange}
          options={recipes.map(recipeToOption)}
        />
      );
    }
    return recipe ? recipe.name : 'No recipe';
  };

  if (isUpgrading()) {
    return (
      <ProcessorProgress
        currentLevel={level}
        label={recipe ? recipe.name : 'No recipe'}
        end={upgradeFinish}
        onComplete={fetchCurrentPlanet}
      />
    );
  }

  if (recipe) {
    return (
      <>
        <TableRow>
          <TableCell component="th" scope="row">
            {level}
          </TableCell>
          <TableCell align="right">{renderSelect()}</TableCell>
          <TableCell align="right">{(ratio * 100).toFixed(2)}%</TableCell>
          <TableCell align="right">
            {!isElectricityGenerator
              ? displayElectricityConsumptionPercent()
              : getGeneratorProduction(id)}
          </TableCell>
          <TableCell align="right">
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
          </TableCell>
          <TableCell>
            <IconButton
              color="secondary"
              onClick={() => setOpen(prev => !prev)}
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
    );
  }

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {level}
      </TableCell>
      <TableCell align="right">{renderSelect()}</TableCell>
      <TableCell align="right">/</TableCell>
      <TableCell align="right">/</TableCell>
      <TableCell align="right">/</TableCell>
      <TableCell>/</TableCell>
    </TableRow>
  );
}

ProcessorRow.propTypes = {
  getMaxElectricityConsumption: func.isRequired,
  getElectricityConsumption: func.isRequired,
  getGeneratorProduction: func.isRequired,
  onRecipeChange: func.isRequired,
  fetchCurrentPlanet: func.isRequired,
  upgradeFinish: number,
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
