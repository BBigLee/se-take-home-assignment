import React, { useState, useEffect } from "react";
import "./MachineManager.css";
import Progress from "../../../components/Progress";

// Define a MachineManager component, for managing machines in the order management system
function MachineManager({ machines, onAddMachine, onRemoveMachine }) {
  // Define a state variable progress to store the progress of machines
  const [progress, setProgress] = useState({});

  // Use useEffect hook to update progress when machines change
  useEffect(() => {
    // Initialize or update progress
    machines.forEach((machine) => {
      // If the machine status is busy and there is a current order
      if (machine.status === "busy" && machine.currentOrder) {
        // If there is no progress for this machine in progress, initialize progress
        if (!progress[machine.id]) {
          setProgress((prev) => ({
            ...prev,
            [machine.id]: 0,
          }));

          // Start progress update
          const startTime = Date.now();
          const interval = setInterval(() => {
            // Calculate the elapsed time
            const elapsed = Date.now() - startTime;
            // Calculate the new progress
            const newProgress = Math.min((elapsed / 10000) * 100, 100);

            // Update progress
            setProgress((prev) => ({
              ...prev,
              [machine.id]: newProgress,
            }));

            // If progress reaches 100, clear the timer
            if (newProgress >= 100) {
              clearInterval(interval);
            }
          }, 100);
        }
      } else {
        // Reset progress
        setProgress((prev) => ({
          ...prev,
          [machine.id]: 0,
        }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machines]);

  // Return the JSX structure of the component
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
              {machines.length > 1 && (
                <div
                  className="remove-machine"
                  onClick={() => onRemoveMachine(machine)}
                >
                  <span>×</span>
                </div>
              )}
            </div>
            {machine.currentOrder && (
              <div className="current-order">
                <div className="order-info">
                  <div>Processing Order #{machine.currentOrder.id}</div>
                  <div className={`order-type ${machine.currentOrder.type}`}>
                    {machine.currentOrder.type.toUpperCase()}
                  </div>
                </div>
                <br />
                <div className="progress-bar-success">
                  <Progress percent={progress[machine.id] || 0} />
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
