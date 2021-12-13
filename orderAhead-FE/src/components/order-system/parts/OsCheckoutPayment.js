import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import OsIconCash from '../icons/OsIconCash';

const OsCheckoutPayment = () => {
  return (
    <div className="os-checkout-group">
      <div className="os-checkout-group__caption">Payment</div>
      <div className="os-checkout-group__body">
        <div className="os-checkout-group__border">
          <div className="os-checkout-list">
            <div className="os-checkout-list__summary">Payment will be made upon pickup. We accept the following payment methods:</div>
            <div className="os-checkout-list__options">
              <div className="os-checkout-list__item"><OsIconCash /> Cash</div>
              <div className="os-checkout-list__item"><OsIconCash /> Debit Card</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OsCheckoutPayment;