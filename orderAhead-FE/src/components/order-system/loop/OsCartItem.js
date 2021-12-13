import React, { useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {range, formatPrice, getCartItemPrice, getCartItemOption} from '../ultility'
import OsIconRemove from '../icons/OsIconRemove';
import { useDispatch, useSelector } from 'react-redux';

const OsCartItem = (props) => {
  const [qty, setQty] = React.useState(1);
  const [option, setOption] = React.useState('1/4 oz');
  const qtys = range(1, 8)

  const handleUpdateOption = (event) => {
    setOption(event.target.value);
  };

  const cartItem = props.data
  const dispatch = useDispatch()
  const items = useSelector(state => state.cartItems)

  const handleRemove = (event) => {
    let updatedItems = items.filter(item => !(item.product.sku == cartItem.product.sku && (!item.tierInfo || item.tierInfo == cartItem.tierInfo)))
    dispatch({type:'set', cartItems: updatedItems})
  };

  const handleUpdate = (event) => {
    setQty(event.target.value);
    let updatedItems = items.map(item => {
      if (item.product.sku == cartItem.product.sku) {
        item.qty = event.target.value
      }
      return item
    })
    dispatch({type:'set', cartItems: updatedItems})
  };



  useEffect(() => {
    setQty(cartItem.qty)
  }, [])

  // const subTotal = cartItem.qty * getCartItemPrice(cartItem)
  const subTotal = cartItem.qty * getCartItemPrice(cartItem)
  const subTotalPrice = formatPrice(subTotal)

  console.log('cartItem')
  console.log(getCartItemPrice(cartItem))
  console.log(cartItem)
  console.log(subTotal)


  return (
	  <div className="os-cart-product-item">
	    <div className="os-cart-product-item__image">
        <img src={cartItem.product.thumbnail} class="w-100" width="100%" />
      </div>
	    <div className="os-cart-product-item__details">
	      <div className="os-cart-product-item__name">{cartItem.product.name}</div>
	      <div className="os-cart-product-item__brand">{cartItem.product.brand}</div>
	      <div className="os-cart-product-item__actions">
	        <div className="os-cart-product-item__weight">
            {getCartItemOption(cartItem)}
          </div>
          <div className="os-seprator"></div>
	        <div className="os-cart-product-item__remove" onClick={handleRemove}><OsIconRemove />&nbsp;Remove</div>
	      </div>
	    </div>
	    <div className="os-cart-product-item__options">
	      <div className="os-cart-product-item__qty">
            <Select
              className="os-cart-item-qty"
              value={qty}
              label="Qty"
              onChange={handleUpdate}
            >
              {qtys.map(qty => <MenuItem value={qty}>{qty}</MenuItem>)}
            </Select>
        </div>
	      <div className="os-cart-product-item__price">{subTotalPrice}</div>
	    </div>
	  </div>

  );
};

export default OsCartItem;