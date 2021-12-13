import React from 'react';
import OsButtonAdd from './OsButtonAdd';
import {useHistory, Link, useLocation} from 'react-router-dom';
import QueryString from 'query-string'
import { useSelector } from 'react-redux';
import {Rating} from '@mui/material'

const OsProductItem = (props) => {
  const history = useHistory();
  const className = "os-product-item"
  const product = props.data
  const gotoProduct = () => {
    history.push(product.link)
  }

  const {search} = useLocation()
  const params = QueryString.parse(search)

  let typeLink = '/order/products?'
  let typeLinkItems = []
  if (params.category) {
    typeLinkItems.push({key: 'category', value: params.category})
  }
  if (params.brand) {
    typeLinkItems.push({key: 'brand', value: params.brand})
  }

  typeLinkItems = typeLinkItems.map(linkItem => linkItem.key + '=' + linkItem.value)
  typeLink += typeLinkItems.join('&')


  const tierPrices = product.tier_prices

  return (
      <div className={className}>
        <div className={`${className}__info`} onClick={gotoProduct}>
          <div className={`${className}__photo`}>
            <img src={product.thumbnail} width="100" />
          </div>
          <div className={`${className}__details`}>
            <div className={`${className}__brand`}>{product.brand}</div>
            <div className={`${className}__name`}>{product.name} <Link to={typeLink+'&type='+product.type}>{product.type}</Link></div>
            <div className={`${className}__rating`}><Rating value={product.rating} precision={0.5} size="small" readOnly /></div>
            <div className={`${className}__features`}>
              <div className={`${className}__strain`}>{product.strain}</div>
              <div className={`${className}__potency`}><span className={`${className}__label`}>THC:</span>&nbsp;25%</div>
            </div>
          </div>
        </div>
        <div className={`${className}__actions`}>
          {product.is_flower && tierPrices &&
            tierPrices.map(tierPrice => <OsButtonAdd className={`${className}__button`} data={product} tierInfo={tierPrice} />)
          }
          {!product.is_flower && <OsButtonAdd className={`${className}__button`} data={product} />}
        </div>
      </div>
  );
};

export default OsProductItem;