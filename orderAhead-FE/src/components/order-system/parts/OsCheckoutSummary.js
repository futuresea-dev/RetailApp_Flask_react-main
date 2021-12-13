import React from 'react';
import { useSelector } from 'react-redux';
import OsSummaryItem from '../loop/OsSummaryItem';

const OsCheckoutSummary = () => {
  const cartItems = useSelector(state => state.cartItems)

  return (
    <div className="os-checkout-group">
      <div className="os-checkout-group__caption">Summary</div>
      <div className="os-checkout-group__body">
        <div className="os-cart-popup__products os-cart-product-list">
          {cartItems.map(cartItem => <OsSummaryItem data={cartItem} />)}
        </div>
      </div>
    </div>
  );
};

export default OsCheckoutSummary;