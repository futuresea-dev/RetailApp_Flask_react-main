import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import OsIconCash from '../icons/OsIconCash';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';


const OsCheckoutMedical = () => {
  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const user = useSelector(state => state.user)
  console.log(user)

  return (
    <div className="os-checkout-group">
      <div className="os-checkout-group__caption">Medical</div>
      <div className="os-checkout-group__body">
        <div className="os-checkout-group__border">
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <TextField id="filled-basic" label="Medical Card Number" variant="filled"  style={{width: '100%'}} value={user.med_id} disabled />
            </Grid>
            <Grid item xs={12}>
              <TextField id="filled-basic" label="Medical Card Expiration" variant="filled" style={{width: '100%'}} value={user.med_expired_date} disabled />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default OsCheckoutMedical;