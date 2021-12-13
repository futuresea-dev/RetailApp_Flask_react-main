import React from 'react';
import {Grid, TextField, Select, MenuItem} from '@mui/material';

const OsOrderGeneral = () => {
  const [value, setValue] = React.useState(new Date());
  const orderStatuses = [
    { code: 'pending', title: 'Pending payment' },
    { code: 'processing', title: 'Processing' },
    { code: 'on-hold', title: 'On hold' },
    { code: 'completed', title: 'Completed' },
    { code: 'cancelled', title: 'Cancelled' },
    { code: 'refunded', title: 'Refunded' },
    { code: 'failed', title: 'Failed' },
  ]
  return (
    <Grid container direction="column" rowSpacing={2}>
      <Grid item><TextField label="Date created" fullWidth></TextField></Grid>
      <Grid item>
        <Select label="Date created" fullWidth value={'pending'}>
          {orderStatuses.map(status => <MenuItem value={status.code}>{status.title}</MenuItem>)}
        </Select>
      </Grid>
    </Grid>
  );
};

export default OsOrderGeneral;