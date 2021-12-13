import React from 'react';
import OsFilterBrands from './sidebar/OsFilterBrands';
import OsFilterProductType from './sidebar/OsFilterProductType';

const OsSidebar = () => {
  return (
    <div className="os-sidebar">
      <OsFilterBrands></OsFilterBrands>
      <OsFilterProductType></OsFilterProductType>
    </div>
  );
};

export default OsSidebar;