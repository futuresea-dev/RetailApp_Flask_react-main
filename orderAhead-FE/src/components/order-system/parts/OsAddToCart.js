import React, { useState } from 'react';
import OsIconCart from '../icons/OsIconCart';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {range} from '../ultility'
import { useDispatch, useSelector } from 'react-redux';
import {formatPrice, convertTierLabel} from '../ultility'

const OsAddToCart = (props) => {
  const [qty, setQty] = React.useState(1);

  const handleChange = (event) => {
    setQty(event.target.value);
  };

  const qtys = range(1, 8)
  const product = props.data
  const dispatch = useDispatch()

  const cartItems = useSelector(state => state.cartItems)
  let updateCartItems = [...cartItems]

  let initState = false
  if (product.tier_prices) initState = product.tier_prices[0]
  const [selectedTier, setSelectedTier] = useState(initState)

  const handleAddToCart = () => {

    const exist = updateCartItems.some(item => item.product.sku == product.sku && (!item.tierInfo || item.tierInfo.name == selectedTier.name))

    if (!exist) {
      let cartItem = {}
      cartItem.product = product
      cartItem.qty = qty
      cartItem.tierInfo = selectedTier
      updateCartItems.push(cartItem)
    } else {
      updateCartItems.map(item => {
        if (item.product.sku == product.sku) {
          item.qty += qty
        }
        return item
      })
    }
    dispatch({type: 'set', cartItems: updateCartItems})
  }

  const handleSelectTier = (e) => {
    e.stopPropagation()
    e.preventDefault()
    let tierName = e.currentTarget.getAttribute('data-tier')

    let tierPrice = product.tier_prices.filter(x => x.name == tierName)
    tierPrice = tierPrice[0]
    setSelectedTier(tierPrice)
  }

  return (
    <>
      <div className="os-product__options os-product-option-list">
        {product.tier_prices && product.tier_prices.map(option =>
          <div data-tier={option.name} className={'os-product-option '+((selectedTier && selectedTier.name == option.name)?' os-product-option--active ':'')+' os-product-item-button'} onClick={handleSelectTier}>
            <div className="os-product-option__weight os-product-item-button__weight">{convertTierLabel(option.name)}</div>
            {/* <div className="os-product-option__price os-product-item-button__price">{formatPrice(option.pricePerUnitInMinorUnits / 100)}</div> */}
          </div>
        )}
      </div>
      <div className="os-product__addtocart">
        <div className="os-addtocart">
          <div className="os-addtocart__qty">
            <FormControl fullWidth>
              <InputLabel id="os-qty-label">Qty</InputLabel>
              <Select
                labelId="os-qty-label"
                id="os-qty-select"
                value={qty}
                label="Qty"
                displayEmpty
                onChange={handleChange}
              >
                {qtys.map(qty => <MenuItem value={qty}>{qty}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
          <div className="os-addtocart__button-wrapper">
            <button className="os-addtocart__button" onClick={handleAddToCart}>
              <OsIconCart></OsIconCart>
              <span>Add to cart</span>
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default OsAddToCart;