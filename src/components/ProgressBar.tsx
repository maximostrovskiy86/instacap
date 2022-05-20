import { FC } from 'react';

type Args = {
  progressPercentage: number;
};

const ProgressBar: FC<Args> = ({ progressPercentage }) => {
  return (
    <div className="h-2 w-full bg-gray-300 overflow-hidden">
      <div
        style={{ width: `${progressPercentage}%` }}
        className={`h-full animate-progress bg-opacity-80 text-opacity-80 ${
          progressPercentage < 70 ? 'bg-red-600' : 'bg-green-600'
        }`}
      ></div>
    </div>
  );
};

export default ProgressBar;
