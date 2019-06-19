import React, { useState, useEffect } from 'react';
import { number, func, shape } from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment';

const ProgressBar = ({ end, duration, onComplete, classes }) => {
  const start = end - duration;
  const now = () => Math.ceil(new Date().getTime());
  const getElapsedTime = () => now() - start;
  const getPercent = () => (getElapsedTime() * 100) / duration;

  const [completed, setCompleted] = useState(getPercent());
  const tick = 200;

  useEffect(() => {
    function progress() {
      setCompleted(prevValue => {
        if (prevValue === 100) {
          return 100;
        }
        if (getPercent() >= 100) {
          onComplete();
          return 100;
        }
        return getPercent();
      });
    }

    const timer = setInterval(progress, tick);
    return () => {
      clearInterval(timer);
    };
  }, [getPercent]);

  return (
    <div className={classes.root}>
      <LinearProgress
        variant="determinate"
        value={completed}
        classes={{ root: classes.progressRoot }}
      />
      <span className={classes.timer}>
        {moment(end + 1000 - new Date().getTime(), 'x').format('mm:ss')}
      </span>
    </div>
  );
};

ProgressBar.propTypes = {
  classes: shape({}).isRequired,
  end: number.isRequired,
  duration: number.isRequired,
  onComplete: func.isRequired,
};

export default ProgressBar;
