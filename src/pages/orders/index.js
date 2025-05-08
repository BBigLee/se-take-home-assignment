import React, { useState, useEffect, useRef } from "react";
import OrderForm from "./components/OrderForm";
import MachineManager from "./components/MachineManager";
import OrderStatus from "./components/OrderStatus";
import "./index.css";

// Define an Orders component, for managing orders
function Orders() {
  // Define order status
  const [orders, setOrders] = useState([]);
  // Define machine status
  const [machines, setMachines] = useState([
    { id: "machine_id_1", status: "idle", currentOrder: null, startTime: null },
  ]);
  // Define pending order status
  const [pendingOrders, setPendingOrders] = useState([]);
  // Define order ID counter
  const orderIdCount = useRef(1);
  // Define machine ID counter
  const machineIdCount = useRef(1);

  // Handle new order
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

  // Add new machine
  const handleAddMachine = () => {
    setMachines((prev) => [
      ...prev,
      {
        id: `machine_id_${++machineIdCount.current}`,
        status: "idle",
        currentOrder: null,
        startTime: null,
      },
    ]);
  };

  // Remove machine
  const handleRemoveMachine = (machine) => {
    setMachines((prev) => prev.filter((item) => item !== machine));
    if (machine.currentOrder?.isProcess) {
      machine.currentOrder.isProcess = false;
      setPendingOrders((prev) => [...prev]);
    }
  };

  // Logic to process orders
  useEffect(() => {
    const processOrders = () => {
      machines.forEach((machine) => {
        if (machine.status === "idle" && pendingOrders.length > 0) {
          const orderToProcess = pendingOrders.find(
            (order) => !order.isProcess
          );
          if (orderToProcess) {

            // Update machine status
            setMachines((prev) =>
              prev.map((m) =>
                m.id === machine.id
                  ? { ...m, status: "busy", currentOrder: orderToProcess }
                  : m
              )
            );

            // Complete the order after 10 seconds
            const timeout = setTimeout(() => {
              // Remove the order from the pending queue
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

              // Reset machine status
              setMachines((prev) =>
                prev.map((m) =>
                  m.id === machine.id
                    ? { ...m, status: "idle", currentOrder: null }
                    : m
                )
              );
            }, 10000);

            orderToProcess.isProcess = true;
            orderToProcess.timeout = timeout;
            setPendingOrders([...pendingOrders]);
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
          <MachineManager
            machines={machines}
            onAddMachine={handleAddMachine}
            onRemoveMachine={handleRemoveMachine}
          />
        </div>
        <div className="right-panel">
          <OrderStatus orders={orders} pendingOrders={pendingOrders} />
        </div>
      </div>
    </div>
  );
}

export default Orders;
