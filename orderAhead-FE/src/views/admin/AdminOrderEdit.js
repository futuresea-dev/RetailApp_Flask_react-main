import React from 'react';
import OsOrderData from './components/order/OsOrderData'
import OsOrderItems from './components/order/OsOrderItems'

const AdminOrderEdit = () => {
  return (
    <div>
      <OsOrderData />
      <OsOrderItems />
    </div>
  );
};

export default AdminOrderEdit;