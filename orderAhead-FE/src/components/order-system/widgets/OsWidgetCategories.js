import React from 'react';
import { useSelector } from 'react-redux';
import OsCategoryItem from '../loop/OsCategoryItem';
import OsLoading from '../OsLoading';

const OsWidgetCategories = () => {
  const isLoading = useSelector(state=>state.isLoading)
  const categories = useSelector(state=>state.categories)
  return (
    <div className="os-widget-categories">
      <div className="os-container">
        <h2 className="os-widget-categories__heading">Categories</h2>
        <div className="os-widget-categories__content os-category-list">
          {isLoading && <OsLoading />}
          {!isLoading &&
            categories.map((item) => <OsCategoryItem data={item} />)
          }
        </div>
      </div>
    </div>
  );
};

export default OsWidgetCategories;