import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OsIconAdd from '../icons/OsIconAdd';
import {formatPrice, convertTierLabel} from '../ultility'

const OsButtonAdd = (props) => {
  const product = props.data
  const tierInfo = props.tierInfo

  const dispatch = useDispatch()

  const cartItems = useSelector(state => state.cartItems)
  let updateCartItems = [...cartItems]
  let qty = 1

  const handleAddToCart = () => {

    const exist = updateCartItems.some(item => item.product.sku == product.sku && (!item.tierInfo || item.tierInfo == tierInfo) )

    if (!exist) {
      let cartItem = {}
      cartItem.product = product
      cartItem.qty = qty
      cartItem.tierInfo = tierInfo
      updateCartItems.push(cartItem)
    } else {
      updateCartItems.map(item => {
        if (item.product.sku == product.sku && item.tierInfo == tierInfo) {
          item.qty += qty
        }
        return item
      })
    }
    dispatch({type: 'set', cartItems: updateCartItems})
  }

  let weight = false
  let price = 0

  if (tierInfo) {
    weight = convertTierLabel(tierInfo.name)
    price = formatPrice(tierInfo.pricePerUnitInMinorUnits / 100)
  } else {
    weight = ''
    price = formatPrice(product.price)
  }


  return (
    <>
      <button value="1/8oz" label="1/8 oz" className={props.className+' os-product-item-button'} onClick={handleAddToCart}>
        <span className="os-product-item-button__icon"><OsIconAdd /></span>
        <span className="os-product-item-button__weight">{weight}</span>
        <span className="os-product-item-button__price">{price}</span>
      </button>
    </>
  );
};

export default OsButtonAdd;