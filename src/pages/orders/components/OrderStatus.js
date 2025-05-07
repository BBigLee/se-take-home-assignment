import React, { useState, useEffect } from "react";
import "./OrderStatus.css";
import Progress from "../../../components/Progress";

function OrderStatus({ orders, pendingOrders }) {
  const [progress, setProgress] = useState({});
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );
  completedOrders.sort(
    (a, b) => new Date(a.finishedAt) - new Date(b.finishedAt)
  );

  useEffect(() => {
    // 初始化或更新进度
    pendingOrders.forEach((order) => {
      if (order.isProcess) {
        if (!progress[order.id]) {
          setProgress((prev) => ({
            ...prev,
            [order.id]: 0,
          }));

          // 启动进度更新
          const startTime = Date.now();
          const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / 10000) * 100, 100);

            setProgress((prev) => ({
              ...prev,
              [order.id]: newProgress,
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
          [order.id]: 0,
        }));
      }
    });
  }, [pendingOrders]);

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
              <br/>
              <div className="progress-bar-success">
                <Progress percent={progress[order.id] || 0} />
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
                Finished: {new Date(order.finishedAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderStatus;
