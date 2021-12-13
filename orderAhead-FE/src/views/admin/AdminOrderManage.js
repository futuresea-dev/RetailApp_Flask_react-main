import React from 'react';
import {Button} from '@mui/material'
import { useHistory } from 'react-router-dom';

const AdminOrderManage = () => {
  const history = useHistory()
  const handleCreateOrderClicked = () => {
    history.push('/order-new')
  }
  return (
    <div>
      <Button onClick={handleCreateOrderClicked}>Create Order</Button>
    </div>
  );
};

export default AdminOrderManage;