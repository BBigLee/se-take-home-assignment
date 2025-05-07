import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Order from './pages/orders';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Order />} />
          <Route path="/order" element={<Order />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;