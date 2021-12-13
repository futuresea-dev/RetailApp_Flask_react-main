import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import OsIconDown from '../icons/OsIconDown';
import OsIconRight from '../icons/OsIconRight';
import OsLoading from '../OsLoading';
import QueryString from 'query-string'

const OsFilterProductType = (props) => {
  const [isCollapsed, setCollapsed] = useState(false)
  const handleClick = () => setCollapsed(!isCollapsed)
  const isLoading = useSelector(state=>state.isLoading)
  const types = useSelector(state=>state.productTypes)

  const {search} = useLocation()
  const params = QueryString.parse(search)

  const activeClass = (loopType) => {
    return (params.type && loopType == params.type)?' os-sidebar-list__item--active':''
  }


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

  return (
    <div className="os-sidebar-widget">
      <div className="os-sidebar-widget__header" onClick={handleClick}>
        <div className="os-sidebar-widget__heading">Product Types</div>
        {isCollapsed && <OsIconRight />}
        {!isCollapsed && <OsIconDown />}
      </div>
      {!isCollapsed &&
      <div className="os-sidebar-widget__content">
        {isLoading && <OsLoading />}
        {!isLoading &&
        <ol className="os-sidebar-widget__list os-sidebar-list">
          {types && types.map(type => <li className={'os-sidebar-list__item' + activeClass(type.name)}>
            <Link className="os-sidebar-list__link" to={typeLink+'&type='+type.name}>{type.name}</Link></li>)}
        </ol>}
      </div>}
    </div>
  );
};

export default OsFilterProductType;