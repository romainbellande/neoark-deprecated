import React from 'react';
import { arrayOf, shape, number, string } from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import ProcessorRow from './ProcessorRow';

function Processors({ processors, resources, classes }) {
  return (
    <Paper >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Level</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Actual Prod/Hour (Max)</TableCell>
            <TableCell align="right">Ratio</TableCell>
            <TableCell align="right">Upgrade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {processors.map(processor => (
            <ProcessorRow key={`proc-row-${processor.id}`} {...processor} resources={resources} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

Processors.propTypes = {
  classes: shape({}).isRequired,
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
