import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { osServices } from '../../../controllers/_services/ordersystem.service';
import { formatPrice } from '../ultility';

const OsCheckoutConfirmation = () => {
  const logoUrl = 'https://images.dutchie.com/a89959a44be67f84f7a949afecf2f35c?auto=format&ixlib=react-9.0.2&h=53&w=65&q=75&dpr=1'
  const cartItems = useSelector(state => state.cartItems)

  let subTotalPrice = 0

  cartItems.forEach(element => {
    subTotalPrice += element.qty*element.product.price
  })

  let tax = 21.31
  let mix = 25.00
  let totalPrice = subTotalPrice + tax + mix

  const history = useHistory()
  if (cartItems.length == 0) {
    history.push('/order')
  }

  const handlePlaceOrder = (e) => {
    const formData = new FormData()

    // https://developer.flowhub.com/api-reference/Order-Ahead/orderahead/neworder
    // {
    //   "address": {
    //     "street1": "string",
    //     "street2": "string",
    //     "city": "string",
    //     "state": "string",
    //     "zip": "string"
    //   },
    //   "externalCreatedAt": "string (date-time)",
    //   "customer": {
    //     "firstName": "string",
    //     "lastName": "string",
    //     "birthDate": "string (date)",
    //     "externalId": "string",
    //     "email": "string",
    //     "phone": "string",
    //     "medRecOrBoth": "med",
    //     "medId": "string",
    //     "medExp": "string"
    //   },
    //   "cartDiscountNote": "string",
    //   "customerNote": "string",
    //   "orderItems": [
    //     {
    //       "productId": 123,
    //       "quantityPurchased": 123,
    //       "discountNote": "string"
    //     }
    //   ],
    //   "orderType": "delivery",
    //   "requestedFulfillmentTimeStart": "string (date-time)",
    //   "requestedFulfillmentTimeEnd": "string (date-time)",
    //   "postbackUrl": "string",
    //   "fees": [
    //     {
    //       "name": "string",
    //       "amount": 123
    //     }
    //   ]
    // }


    osServices.osPlaceOrder(formData).then(response => {
      alert('Order placed')
    })
  }

  return (
    <>
      <div className="confirmation">
        <div className="confirmation__header">
          <div className="confirmation__logo">
            <img src={logoUrl} />
          </div>
          <div className="confirmation__store">
            <div className="confirmation__title">Open Ahead</div>
            <div className="confirmation__estimate-pickup">Est. pickup | 20 - 30 min</div>
          </div>
        </div>
        <div className="confirmation__body">
          <div className="confirmation__table">
            <div className="confirmation__item">
              <div className="confirmation__label">Subtotal:</div>
              <div className="confirmation__value">{formatPrice(subTotalPrice)}</div>
            </div>
            <div className="confirmation__item">
              <div className="confirmation__label">Mix and Match:</div>
              <div className="confirmation__value">{formatPrice(mix)}</div>
            </div>
            <div className="confirmation__item">
              <div className="confirmation__label">Taxes:</div>
              <div className="confirmation__value">{formatPrice(tax)}</div>
            </div>
          </div>
          <div className="confirmation__promo-code"></div>
        </div>
        <div className="confirmation__footer">
          <div className="confirmation__total">
            <div className="confirmation__label">ORDER TOTAL:</div>
            <div className="confirmation__value">{formatPrice(totalPrice)}</div>
          </div>
          <div className="confirmation__button-placeorder" onClick={handlePlaceOrder}>PLACE ORDER</div>
          <div className="confirmation__note-term">By placing an order you agree to our Terms and to receive automated text message updates.</div>
        </div>
      </div>
    </>
  );
};

export default OsCheckoutConfirmation;