import React from 'react';
import OsCheckoutType from '../parts/OsCheckoutType'
import OsCheckoutPayment from '../parts/OsCheckoutPayment'
import OsCheckoutMedical from '../parts/OsCheckoutMedical'
import OsCheckoutSummary from '../parts/OsCheckoutSummary'

const OsCheckoutForm = () => {
  return (
    <div className="os-checkout-form">
      <div className="os-checkout-form__header">
        <div className="os-checkout-form__heading">Checkout</div>
      </div>
      <div className="os-checkout-form__section">
        <OsCheckoutType />
        <OsCheckoutPayment />
        <OsCheckoutMedical />
      </div>
      <div className="os-checkout-form__section">
        <OsCheckoutSummary />
      </div>
    </div>
  );
};

export default OsCheckoutForm;