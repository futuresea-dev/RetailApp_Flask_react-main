import React, { useEffect, useState } from 'react';
import OsCategoryItem from '../loop/OsCategoryItem';
import Slider from "react-slick";
import { useSelector } from 'react-redux';
import OsLoading from '../OsLoading';
import {osServices} from '../../../controllers/_services/ordersystem.service'
import {formatPrice} from '../ultility'
import { useHistory } from 'react-router';

const OsWidgetSliderProductTypes = (props) => {
  const [isLoading, setLoading] = useState(false)
  const category = props.data
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    draggable: false,
  };

  const [productTypes, setProductTypes] = useState([])

  useEffect(() => {
    setLoading(true)
    osServices.osLoadProductTypesByCategory({category: category.name}).then(response => {
      setProductTypes(response.data)
      setLoading(false)
    })
  }, [])

  const history = useHistory()
  const handleGotoType = (e) => {
    e.stopPropagation()
    e.preventDefault()
    history.push('/order/products/?type=' + e.currentTarget.getAttribute('data-name'))
  }


  return (
    <>
        <div class="os-container">
          <div class="os-slider-product-types">
              <div class="os-slider-product-types__heading">{category.name}</div>
              {isLoading && <OsLoading />}
              {!isLoading &&
              <div class="os-slider-product-types__slider">
                <Slider {...settings} >
                  {productTypes.map(productType =>
                    <div key={productType.handle} class="os-slider-type-item" data-name={productType.name} onClick={handleGotoType}>
                      <div class="os-slider-type-item__photo"><img src={productType.thumbnail} width="175" height="175" /></div>
                      <div class="os-slider-type-item__price">{formatPrice(productType.price_from)} - {formatPrice(productType.price_to)}</div>
                      <div class="os-slider-type-item__name">{productType.name}</div>
                      <div class="os-slider-type-item__brands">{productType.brands}</div>
                    </div>
                  )}
                </Slider>
              </div>}
          </div>
        </div>
    </>
  );
};

export default OsWidgetSliderProductTypes;