import React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {formatPrice, range, getCartItemOption} from '../ultility'
import OsIconRemove from '../icons/OsIconRemove';

const OsSummaryItem = (props) => {
	const cartItem = props.data

	const option = getCartItemOption(cartItem)


  return (
	  <div className="os-cart-product-item">
	    <div className="os-cart-product-item__details">
	      <div className="os-cart-product-item__name">{cartItem.product.name}</div>
	      <div className="os-cart-product-item__brand">{cartItem.product.brand}</div>
	      {option && <div className="os-cart-product-item__actions">
	        <div className="os-cart-product-item__weight">{option}</div>
          <div className="os-seprator"></div>
	      </div>}
	    </div>
	    <div className="os-cart-product-item__options">
	      <div className="os-cart-product-item__qty">
					{cartItem.qty}
        </div>
	      <div className="os-cart-product-item__price">{formatPrice(cartItem.product.price*cartItem.qty)}</div>
	    </div>
	  </div>

  );
};

export default OsSummaryItem;