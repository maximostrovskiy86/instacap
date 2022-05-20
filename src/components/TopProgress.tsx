import { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';

const TopProgress = () => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    let progress = 0;
    let invervalSpeed = 1;
    let incrementSpeed = 0.1;

    const progressInterval = setInterval(function () {
      progress += incrementSpeed;
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
      setWidth(progress);
    }, invervalSpeed);
  }, []);
  return <ProgressBar progressPercentage={width} />;
};

export default TopProgress;
