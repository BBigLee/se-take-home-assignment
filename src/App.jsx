import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Order from './pages/orders';

// Define a function component named App as the root component of the React application
function App() {
  // Return a Router component that contains a Layout component, which in turn contains a Routes component
  return (
    <Router>
      <Layout>
        <Routes>
           {/* Define a Route component with the path "/" that renders the Order component */}
          <Route path="/" element={<Order />} />
           {/* Define a Route component with the path "/order" that renders the Order component */}
          <Route path="/order" element={<Order />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;