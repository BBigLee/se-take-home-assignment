import React from 'react';

// 定义一个名为Layout的函数组件，接收一个参数children
const Layout = ({ children }) => {
  // 返回一个div元素，class为layout，包含children
  return (
    <div className="layout">
      {children}
    </div>
  );
};

export default Layout;
