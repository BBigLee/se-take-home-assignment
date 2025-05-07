import React, { useState } from 'react';
import './OrderForm.css';

function OrderForm({ onSubmit }) {
  const [orderType, setOrderType] = useState('regular');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type: orderType,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="order-form">
      <h2>Create New Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Order Type:</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
          >
            <option value="regular">Regular Order</option>
            <option value="vip">VIP Order</option>
          </select>
        </div>
        <button type="submit">Create Order</button>
      </form>
    </div>
  );
}

export default OrderForm;
