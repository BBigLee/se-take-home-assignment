import React, { useState, useEffect } from "react";
import "./OrderStatus.css";
import Progress from "../../../components/Progress";

// Defin an OrderStatus component，for displaying the status of orders
function OrderStatus({ orders, pendingOrders }) {
  // Define a state variable progress to store the progress of orders
  const [progress, setProgress] = useState({});
  // Filter out completed orders
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );
  // Sort by completion time
  completedOrders.sort(
    (a, b) => new Date(a.finishedAt) - new Date(b.finishedAt)
  );

  // useEffect hook for initializing or updating progress
  useEffect(() => {
    // Initialize or update progress
    pendingOrders.forEach((order) => {
      if (order.isProcess) {
        if (!progress[order.id]?.percent) {
          setProgress((prev) => ({
            ...prev,
            [order.id]: { percent: 0 },
          }));

          // Start progress update
          const startTime = Date.now();
          const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / 10000) * 100, 100);

            setProgress((prev) => ({
              ...prev,
              [order.id]: { percent: newProgress, interval },
            }));

            if (newProgress >= 100) {
              clearInterval(interval);
            }
          }, 100);
        }
      } else {
        if (progress[order.id]) {
          clearInterval(progress[order.id].interval);
          clearTimeout(order.timeout)
        }
        setProgress((prev) => ({
          ...prev,
          [order.id]: { percent: 0 },
        }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingOrders]); // Dependency array for useEffect

  return (
    <div className="order-status">
      <div className="status-section">
        <h2>Pending Orders</h2>
        <div className="orders-list">
          {pendingOrders.map((order) => (
            <div
              key={order.id}
              className={`order-card pending ${
                order.type === "vip" ? "vip" : ""
              }`}
            >
              <div>Order #{order.id}</div>
              <div>Type: {order.type}</div>
              <div className="timestamp">
                Created: {new Date(order.createdAt).toLocaleTimeString()}
              </div>
              <br />
              <div className="progress-bar-success">
                <Progress percent={progress[order.id]?.percent || 0} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="status-section">
        <h2>Completed Orders</h2>
        <div className="orders-list">
          {completedOrders.map((order) => (
            <div
              key={order.id}
              className={`order-card completed ${
                order.type === "vip" ? "vip" : ""
              }`}
            >
              <div>Order #{order.id}</div>
              <div>Type: {order.type}</div>
              <div className="timestamp">
                Created: {new Date(order.createdAt).toLocaleTimeString()}
              </div>
              <div className="timestamp">
                Completed: {new Date(order.finishedAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderStatus;
