import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouteMatch, Link } from 'react-router-dom'
import OsIconDrop from './icons/OsIconDrop'
import OsMinicart from './OsMinicart'
import OsLoading from './OsLoading'

const OsTopNav = () => {
  const {url} = useRouteMatch()
  const categories = useSelector(state => state.categories)
  const brands = useSelector(state => state.brands)
  const isLoading = useSelector(state => state.isLoading)

  const OsItem = (props) => (<div className="os-header__item os-topnav__item">{props.children}</div>)
  const OsLink = (props) => (<Link className="os-header__link os-topnav__link" to={props.to}>{props.children}</Link>)
  const OsItemLink = (props) => (<OsItem><OsLink to={props.to}>{props.children}</OsLink></OsItem>)
  const OsItemDropdown = (props) => {
    const [isPopup, showPopup] = useState(false)
    const handlePopup = () => {
      showPopup(!isPopup)
    }
    return (
      <div className="os-header__item os-topnav__item os-header-dropdown">
        <a className="os-header__link os-topnav__link os-header-dropdown__link" onClick={handlePopup}>
          {props.title} <OsIconDrop />
        </a>
        {isPopup && <div className="os-header-dropdown__content">
          {props.children}
        </div>}
      </div>
    )
  }

  return (
    <>
      <div className="os-header">
        <div className="os-container">
          <div className="os-header__inner">
            <nav className="os-header__nav os-topnav">
              <OsItemLink to={`${url}`}>Home</OsItemLink>
              <OsItemDropdown title="Categories">
                {isLoading && <OsLoading />}
                {!isLoading && categories.map(category =>
                  <OsItemLink key={category.handle} to={`${category.link}`}>{category.name}</OsItemLink>
                )}
              </OsItemDropdown>
              <OsItemDropdown title="Brands">
                {isLoading && <OsLoading />}
                {!isLoading && brands.map(brand =>
                  <OsItemLink key={brand.handle} to={`${brand.link}`}>{brand.name}</OsItemLink>
                )}
              </OsItemDropdown>
              <OsItemLink to={`/order/types`}>Product Types</OsItemLink>
            </nav>
            <OsMinicart />
          </div>
        </div>
      </div>
    </>
  )
}

export default OsTopNav