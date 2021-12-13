import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import OsIconClose from './icons/OsIconClose';
import OsCartItem from './loop/OsCartItem';
import OsIconCartEmpty from './icons/OsIconCartEmpty'
import { formatPrice, getCartItemPrice } from './ultility';

const OsCartPopup = (props) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const items = useSelector(state => state.cartItems)
  const isCartEmpty = items.length == 0
  let total = 0

  items.forEach(item => total += getCartItemPrice(item)*item.qty)



  return (
    <div className="os-cart-popup">
      <div className="os-cart-popup__header">
        <div className="os-cart-popup__overview">
          <div className="os-cart-popup__title">Shopping Cart</div>
          {!isCartEmpty &&
            <div className="os-cart-popup__subtotal">Subtotal:&nbsp;{formatPrice(total)}</div>
          }
        </div>
        <button className="os-cart-popup__close" onClick={props.closeDrawer()}>
          <OsIconClose />&nbsp; Close
        </button>
      </div>
      <div className="os-cart-popup__details">
        <div className="os-cart-popup__products os-cart-product-list">
          {isCartEmpty && <div class="os-cart-emtpy"><OsIconCartEmpty /> <h1>Your Cart is Empty</h1></div>}
          {items.map(item => <OsCartItem data={item} />)}
        </div>
      </div>
      {!isCartEmpty &&
      <div className="os-cart-popup__footer">
        <button className="os-cart-popup__checkout-button" onClick={(e) => {e.preventDefault();props.closeDrawer();history.push('/order/checkout')}}>Proceed to checkout</button>
        <div className="os-cart-popup__right">
          <div className="os-cart-popup__total">Subtotal: {formatPrice(total)}</div>
          <div className="os-cart-popup__taxnote">*Cannabis tax will be added at checkout.</div>
        </div>
      </div>}
    </div>
  );
};

export default OsCartPopup;