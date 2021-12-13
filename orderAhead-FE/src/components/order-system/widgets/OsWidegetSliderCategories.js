import React, { useEffect, useState } from 'react';
import OsCategoryItem from '../loop/OsCategoryItem';
import Slider from "react-slick";
import { useSelector } from 'react-redux';
import OsLoading from '../OsLoading';

const OsWidegetSliderCategories = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1
  };

  const isLoading = useSelector(state => state.isLoading)
  const categories = useSelector(state => state.categories)

  return (
    <div className="os-widget-categories">
      <div className="os-container">
        <h2 className="os-widget-categories__heading">Categories</h2>
        <div className="os-widget-categories__content">
          {isLoading && <OsLoading />}
          {!isLoading && <Slider {...settings}>
            {categories.map((item) => <OsCategoryItem data={item} />)}
          </Slider>}
        </div>
      </div>
    </div>
  );
};

export default OsWidegetSliderCategories;