import React, { useState, useEffect } from "react";
import "./MachineManager.css";
import Progress from '../../../components/Progress'

function MachineManager({ machines, onAddMachine }) {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    // 初始化或更新进度
    machines.forEach((machine) => {
      if (machine.status === "busy" && machine.currentOrder) {
        if (!progress[machine.id]) {
          setProgress((prev) => ({
            ...prev,
            [machine.id]: 0,
          }));

          // 启动进度更新
          const startTime = Date.now();
          const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / 10000) * 100, 100);

            setProgress((prev) => ({
              ...prev,
              [machine.id]: newProgress,
            }));

            if (newProgress >= 100) {
              clearInterval(interval);
            }
          }, 100);
        }
      } else {
        // 重置进度
        setProgress((prev) => ({
          ...prev,
          [machine.id]: 0,
        }));
      }
    });
  }, [machines]);

  return (
    <div className="machine-manager">
      <h2>Machine Management</h2>
      <div className="machines-list">
        {machines.map((machine) => (
          <div key={machine.id} className={`machine ${machine.status}`}>
            <div className="machine-header">
              <div>Machine: #{machine.id}</div>
              <div className="machine-status">
                <span className={`machine-status-indicator ${machine.status}`}>
                  Status:{" "}
                </span>
                <span className="status-text">{machine.status}</span>
              </div>
            </div>
            {machine.currentOrder && (
              <div className="current-order">
                <div className="order-info">
                  <div>Processing Order #{machine.currentOrder.id}</div>
                  <div className={`order-type ${machine.currentOrder.type}`}>
                    {machine.currentOrder.type.toUpperCase()}
                  </div>
                </div>
                <br/>
                <div className="progress-bar-success">
                  <Progress percent={progress[machine.id]||0} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={onAddMachine}>Add New Machine</button>
    </div>
  );
}

export default MachineManager;
