import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { number, func, string } from 'prop-types';

import ProgressBar from '../../../ProgressBar';

const ProcessorProgress = ({ label, end, onComplete, currentLevel }) => {
  return (
    <TableRow>
      <TableCell colSpan={1}>
        {currentLevel} -&gt; {currentLevel + 1}
      </TableCell>
      <TableCell colSpan={1} align="center">
        {label}
      </TableCell>
      <TableCell colSpan={4}>
        <ProgressBar end={end} duration={10 * 1000 + 1000} onComplete={onComplete} />
      </TableCell>
    </TableRow>
  );
};

ProcessorProgress.propTypes = {
  currentLevel: number.isRequired,
  label: string.isRequired,
  end: number.isRequired,
  onComplete: func.isRequired,
};

export default ProcessorProgress;
