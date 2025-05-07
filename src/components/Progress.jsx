import React from 'react';
import '../styles/progress.css';

// 定义一个Progress组件，接收一个percent参数
const Progress = ({ percent }) => {
  // 确保进度值在0-100之间
  const normalizedPercent = Math.min(100, Math.max(0, percent));

  return (
    <div className="progress-bar">
      {/* 根据进度值设置进度条的宽度 */}
      <div
        className="progress-bar-fill"
        style={{ width: `${normalizedPercent}%` }}
      />
    </div>
  );
};

export default Progress;