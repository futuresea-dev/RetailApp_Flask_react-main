import React, { useEffect, useState } from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import OsIconLeft from '../icons/OsIconLeft';
import OsAddToCart from '../parts/OsAddToCart';
import { osServices } from '../../../controllers/_services/ordersystem.service';
import OsLoading from '../OsLoading';
import OsProductReviews from '../OsProductReviews'
import {formatPrice} from '../ultility'
import OsProductMediaGallery from '../parts/OsProductMediaGallery'

const OsProductPage = (props) => {
  const note = '*Cannabis tax will be added at checkout.'
  const tags = ['Hybrid']

  const [isLoading, setLoading] = useState(false)
  const [product, setProduct] = useState({})
  let { sku } = useParams();

  const history = useHistory()

  const [productPrice, setProductPrice] = useState(0)

  useEffect(() => {
    setLoading(true)
    const params = {
      sku: sku,
    }

    osServices.osLoadProduct(params).then((response) => {
      setProduct(response.data)

      let min_price = 9999999
      let max_price = 0
      if (response.data.tier_prices) {
        response.data.tier_prices.map(tier => {
          if (min_price > tier.pricePerUnitInMinorUnits) {
            min_price = tier.pricePerUnitInMinorUnits / 100
          }
          if (max_price < tier.pricePerUnitInMinorUnits) {
            max_price = tier.pricePerUnitInMinorUnits / 100
          }
        })
        if (max_price) {
          setProductPrice(formatPrice(min_price) + ' - ' + formatPrice(max_price))
        } else {
          setProductPrice(formatPrice(0))
        }

      } else {
        setProductPrice(formatPrice(response.data.price))
      }

      setLoading(false)
    })
  }, [])



  return (
    <>
      <div className="os-container">
        <div className="os-layout os-layout--1column">
          <div className="os-layout__main">
            <Link className="os-goback" onClick={ () => {
                /* go back from *EditCover* to *Cover* */
                history.goBack();
            }}><OsIconLeft /> Back</Link>

            {isLoading && <div className="mt-1"><OsLoading /></div>}
            {!isLoading &&
            <div className="os-product row">
              <div className="os-product__photo col-5">
                <OsProductMediaGallery data={product} />
              </div>
              <div className="os-product__details col-7">
                <div className="os-product__type">{product.type}</div>
                <div className="os-product__brand">{product.brand}</div>
                <div className="os-product__name">{product.name}</div>
                <div className="os-product__price">{productPrice}</div>
                <OsAddToCart data={product} />
                <div className="os-product__note">{note}</div>
                <div className="os-horz-line" />
                <div className="os-product__tags">
                  {tags.map(tag =>
                    <div className="os-product-tag"><span>{tag}</span></div>
                  )}
                </div>
                <div className="os-product__desc">
                  {product.desc}
                </div>

                <OsProductReviews data={product.reviews} />
              </div>
            </div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default OsProductPage;