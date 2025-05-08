import React, { useState } from 'react';
import './OrderForm.css';

// Define an OrderForm component，for creating new orders
function OrderForm({ onSubmit }) {
  // Use useState hook to manage order type state, default is 'regular'
  const [orderType, setOrderType] = useState('regular');

  // Handle form submission event
  const handleSubmit = (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    // Call onSubmit callback function, passing order type and creation time
    onSubmit({
      type: orderType,
      createdAt: new Date().toISOString()
    });
  };

  // Render the order form
  return (
    <div className="order-form">
      <h2>Create New Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Order Type:</label>
          <select
            value={orderType}
            // Update order type state when selection changes
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
