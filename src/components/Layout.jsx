import React from 'react';

// Define a function component named Layout that takes a parameter called children
const Layout = ({ children }) => {
  // Returns a div element with a class of layout, containing children
  return (
    <div className="layout">
      {children}
    </div>
  );
};

export default Layout;
