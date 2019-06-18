import React from 'react';
import { arrayOf, number, shape } from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function Resources({ resources, classes }) {
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">Rate</TableCell>
            <TableCell align="right">Net rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resources.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
              <TableCell align="right">{row.rate}</TableCell>
              <TableCell align="right">{row.netRate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

Resources.propTypes = {
  classes: shape({}).isRequired,
  resources: arrayOf(
    shape({
      value: number.isRequired,
      rate: number.isRequired,
      netRate: number.isRequired,
    })
  ),
};

Resources.defaultProps = {
  resources: [],
};

export default Resources;
