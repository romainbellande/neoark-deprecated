import React, { useState, useEffect } from 'react';
import { number, func, shape, bool } from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment';

const ProgressBar = ({ end, duration, onComplete, classes, loop, pause }) => {
  const [start, setStart] = useState(end - duration);
  const now = () => Math.ceil(new Date().getTime());
  const getElapsedTime = currentStart => now() - currentStart;
  const getPercent = currentStart => (getElapsedTime(currentStart) * 100) / duration;

  const [completed, setCompleted] = useState(getPercent(start));
  const tick = 200;

  useEffect(() => {
    function progress() {
      if (!pause) {
        setCompleted(prevValue => {
          let newValue = getPercent(start);
          if (prevValue === 100) {
            if (loop) {
              setStart(new Date().getTime());
            }
            newValue = loop ? 0 : 100;
          } else if (getPercent(start) >= 100) {
            onComplete();
            if (loop) {
              setStart(new Date().getTime());
            }
            newValue = loop ? 0 : 100;
          }

          return newValue;
        });
      }
    }

    const timer = setInterval(progress, tick);

    return () => {
      clearInterval(timer);
    };
  }, [getPercent, start, pause]);

  return (
    <div className={classes.root}>
      <LinearProgress
        variant="determinate"
        value={completed}
        classes={{ root: classes.progressRoot }}
      />
      <span className={classes.timer}>
        {pause
          ? 'paused'
          : moment(start + duration + 1000 - new Date().getTime(), 'x').format('mm:ss')}
      </span>
    </div>
  );
};

ProgressBar.propTypes = {
  classes: shape({}).isRequired,
  end: number.isRequired,
  duration: number.isRequired,
  onComplete: func.isRequired,
  loop: bool,
  pause: bool,
};

ProgressBar.defaultProps = {
  loop: false,
  pause: false,
};

export default ProgressBar;
