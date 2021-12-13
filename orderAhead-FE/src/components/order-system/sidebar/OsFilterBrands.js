import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import OsIconDown from '../icons/OsIconDown';
import OsIconRight from '../icons/OsIconRight';
import OsLoading from '../OsLoading';
import QueryString from 'query-string'

const OsFilterBrands = () => {
  const [isCollapsed, setCollapsed] = useState(false)
  const handleClick = () => setCollapsed(!isCollapsed)
  const isLoading = useSelector(state=>state.isLoading)
  const brands = useSelector(state=>state.brands)
  const {search} = useLocation()

  const params = QueryString.parse(search)
  const activeClass = (loopBrand) => {
    return (params.brand && loopBrand == params.brand)?' os-sidebar-list__item--active':''
  }

  return (
    <div className="os-sidebar-widget">
      <div className="os-sidebar-widget__header" onClick={handleClick}>
        <div className="os-sidebar-widget__heading">Brands</div>
        {isCollapsed && <OsIconRight />}
        {!isCollapsed && <OsIconDown />}
      </div>
      {!isCollapsed &&
      <div className="os-sidebar-widget__content">
        {isLoading && <OsLoading />}
        {!isLoading &&
        <ol className="os-sidebar-widget__list os-sidebar-list">
          {brands.map(brand => <li className={'os-sidebar-list__item' + activeClass(brand.name)}><Link className="os-sidebar-list__link" to={brand.link}>{brand.name}</Link></li>)}
        </ol>}
      </div>}
    </div>
  );
};

export default OsFilterBrands;