import React from 'react'
import formatPrice from './_helper'

const PurchaseItem = (props) => {
  const defaults = {
    qty: 1,
    name: '<item name>',
    category: 'Northwoods Wellness',
    price: 0,
    tax: 0,
    total: 0,
  }

  const item = {...defaults, ...props.data}

  return (
    <div className="purchase-item">
      <div className="purchase-item__left">
        <div className="purchase-item__image">
          <img src={'/img/icon-item2.png'} />
        </div>
        <div className="purchase-item__name">{item.qty} x {item.name}</div>
        <div className="purchase-item__category">{item.category}</div>
      </div>

      <div className="purchase-item__right">
        <div className="purchase-item__price">
          <div className="purchase-item__label">List Price</div>
          <div className="purchase-item__value">{formatPrice(item.price)}</div>
        </div>
        <div className="purchase-item__tax">
          <div className="purchase-item__label">Tax</div>
          <div className="purchase-item__value">{formatPrice(item.tax)}</div>
        </div>
        <div className="purchase-item__total">
          <div className="purchase-item__label">Total</div>
          <div className="purchase-item__value">{formatPrice(item.total)}</div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  row: {
    borderBottom: '1px solid #ebeff4',
  },
}

export default PurchaseItem