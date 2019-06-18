import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

function Progress() {
  return <LinearProgress variant="determinate" value={0} />;
}

Progress.propTypes = {};

Progress.defaultProps = {};

export default Progress;
