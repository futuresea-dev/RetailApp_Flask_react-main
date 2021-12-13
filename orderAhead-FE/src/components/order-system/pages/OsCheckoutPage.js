import React from 'react';
import OsCheckoutConfirmation from '../parts/OsCheckoutConfirmation';
import OsCheckoutForm from '../parts/OsCheckoutForm';

const OsCheckoutPage = () => {
  return (
    <div className="os-layout">
      <div className="os-container">
        <div className="row">
          <div className="col-8"><OsCheckoutForm /></div>
          <div className="col-4"><OsCheckoutConfirmation /></div>
        </div>
      </div>
    </div>
  );
};

export default OsCheckoutPage;