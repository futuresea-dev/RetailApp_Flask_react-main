import React from 'react';
import OsProductTypeItem from '../loop/OsProductTypeItem';
import OsSidebar from '../OsSidebar';
import OsContentHeader from '../OsContentHeader';
import OsWidgetCategories from '../widgets/OsWidgetCategories';
import OsWidgetSliderProductTypes from '../widgets/OsWidgetSliderProductTypes';
import OsLoading from '../OsLoading';
import { useSelector } from 'react-redux';

const OsTypeListPage = (props) => {
  const isLoading = useSelector(state => state.isLoading)
  const categories = useSelector(state => state.categories)
  const title = 'Product Types'

  return (
    <>
      <div className="os-container">
        <div className="os-layout os-layout--2columns-left">
          <div className="os-layout__sidebar">
            <OsSidebar />
          </div>
          <div className="os-layout__main">
            <OsContentHeader data={{title: title}} />
            {isLoading && <OsLoading />}
            {!isLoading &&
            categories.map(category => <OsWidgetSliderProductTypes data={category} />)}
          </div>
        </div>
      </div>
      <div className="os-layout">
        <OsWidgetCategories />
      </div>
    </>
  );
};

export default OsTypeListPage;