import React from 'react';
import '../styles/progress.css';

// 定义一个Progress组件，接收一个percent参数
const Progress = ({ percent }) => {
  // Ensure the progress value is between 0 and 100
  const normalizedPercent = Math.min(100, Math.max(0, percent));

  return (
    <div className="progress-bar">
      {/* Set the width of the progress bar based on the progress value */}
      <div
        className="progress-bar-fill"
        style={{ width: `${normalizedPercent}%` }}
      />
    </div>
  );
};

export default Progress;