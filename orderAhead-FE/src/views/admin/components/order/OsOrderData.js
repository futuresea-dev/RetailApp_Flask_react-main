import React from 'react';
import {Grid} from '@mui/material'
import OsOrderGeneral from './OsOrderGeneral'
import OsOrderBilling from './OsOrderBilling'
import OsOrderShipping from './OsOrderShipping'

const OsOrderData = ({children}) => {
  return (
    <div class="os-order-data d-flex">
      <Grid container spacing={2}>
        <Grid item md="4">
          <OsOrderGeneral></OsOrderGeneral>
        </Grid>
        <Grid item md="4">
          <OsOrderBilling></OsOrderBilling>
        </Grid>
        <Grid item md="4">
          <OsOrderShipping></OsOrderShipping>
        </Grid>
      </Grid>
    </div>
  );
};

export default OsOrderData;