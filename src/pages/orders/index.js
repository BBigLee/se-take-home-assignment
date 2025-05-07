import React, { useState, useEffect, useRef } from "react";
import OrderForm from "./components/OrderForm";
import MachineManager from "./components/MachineManager";
import OrderStatus from "./components/OrderStatus";
import "./index.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [machines, setMachines] = useState([
    { id: 'machine_id_1', status: "idle", currentOrder: null, startTime: null },
  ]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const orderIdCount = useRef(1);
  const machineIdCount = useRef(1);

  // 处理新订单
  const handleAddOrder = (order) => {
    const newOrder = {
      ...order,
      id: `order_id_${orderIdCount.current++}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [...prev, newOrder]);
    if (order.type === "vip") {
      // Find the last VIP order in the queue
      const lastVipIndex = pendingOrders.findLastIndex((o) => o.type === "vip");
      const newPendingOrders = [...pendingOrders];

      if (lastVipIndex === -1) {
        // If no VIP orders yet, add to the start
        newPendingOrders.unshift(newOrder);
      } else {
        // Insert after the last VIP order
        newPendingOrders.splice(lastVipIndex + 1, 0, newOrder);
      }
      setPendingOrders(newPendingOrders);
    } else {
      setPendingOrders((prev) => {
        if (prev.length === 0) {
          return [newOrder];
        }
        return [...prev, newOrder];
      });
    }
  };

  // 添加新机器
  const handleAddMachine = () => {
    setMachines((prev) => [
      ...prev,
      {
        id: `machine_id_${machineIdCount.current++}`,
        status: "idle",
        currentOrder: null,
        startTime: null,
      },
    ]);
  };

  // 处理订单的逻辑
  useEffect(() => {
    const processOrders = () => {
      machines.forEach((machine) => {
        if (machine.status === "idle" && pendingOrders.length > 0) {
          const orderToProcess = pendingOrders.find(
            (order) => !order.isProcess
          );
          if (orderToProcess) {
            orderToProcess.isProcess = true;
            setPendingOrders([...pendingOrders]);

            // 更新机器状态
            setMachines((prev) =>
              prev.map((m) =>
                m.id === machine.id
                  ? { ...m, status: "busy", currentOrder: orderToProcess }
                  : m
              )
            );

            // 10秒后完成订单
            setTimeout(() => {
              // 从待处理队列中移除订单
              setPendingOrders((prev) =>
                prev.filter(({ id }) => id !== orderToProcess.id)
              );
              setOrders((prev) =>
                prev.map((order) =>
                  order.id === orderToProcess.id
                    ? {
                        ...order,
                        status: "completed",
                        finishedAt: Date.now(),
                      }
                    : order
                )
              );

              // 重置机器状态
              setMachines((prev) =>
                prev.map((m) =>
                  m.id === machine.id
                    ? { ...m, status: "idle", currentOrder: null }
                    : m
                )
              );
            }, 10000);
          }
        }
      });
    };

    processOrders();
  }, [machines, pendingOrders]);

  return (
    <div className="orders-page">
      <h1>Order Processing System</h1>
      <div className="main-content">
        <div className="left-panel">
          <OrderForm onSubmit={handleAddOrder} />
          <MachineManager machines={machines} onAddMachine={handleAddMachine} />
        </div>
        <div className="right-panel">
          <OrderStatus orders={orders} pendingOrders={pendingOrders} />
        </div>
      </div>
    </div>
  );
}

export default Orders;
