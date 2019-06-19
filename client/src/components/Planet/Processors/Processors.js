import React from 'react';
import { arrayOf, shape, number, string } from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import BatteryChargingFullIcon from '@material-ui/icons/BatteryChargingFull';

import ProcessorRow from './ProcessorRow';

function Processors({ processors, items }) {
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Level</TableCell>
            <TableCell align="right">Recipe</TableCell>
            <TableCell align="right">Ratio</TableCell>
            <TableCell align="right">
              <BatteryChargingFullIcon />
            </TableCell>
            <TableCell align="right">Upgrade</TableCell>
            <TableCell align="right">Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {processors.map(processor => (
            <ProcessorRow key={`proc-row-${processor.id}`} {...processor} items={items} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

Processors.propTypes = {
  items: arrayOf(shape({})).isRequired,
  processors: arrayOf(
    shape({
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
    })
  ).isRequired,
};

export default Processors;
