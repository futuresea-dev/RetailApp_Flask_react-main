import React, { useEffect } from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'
import OsTopNav from './order-system/OsTopNav'
import routes from './order-system/routes'
import { osServices } from '../controllers/_services/ordersystem.service';
import { useDispatch } from 'react-redux';
import QueryString from 'query-string'

const OrderSystem = ({ match }) => {
  const dispatch = useDispatch()
  const setCategories = (data) => dispatch({type: 'set', categories: data})
  const setBrands = (data) => dispatch({type: 'set', brands: data})
  const setTypes = (data) => dispatch({type: 'set', productTypes: data})

  const {search} = useLocation()
  const params = QueryString.parse(search)

  useEffect(() => {
    dispatch({type: 'set', isLoading: true})
    osServices.osLoadCategories().then((response) => {
      setCategories(response.data)
      dispatch({type: 'set', isLoading: false})
    })
    osServices.osLoadBrands({}).then((response) => {
      setBrands(response.data)
      dispatch({type: 'set', isLoading: false})
    })
    osServices.osLoadTypes(params).then((response) => {
      setTypes(response.data)
      dispatch({type: 'set', isLoading: false})
    })
  }, [])


  return (
    <div className="order-system">
      <h1 className="order-system__heading text-center">Online System</h1>
      <OsTopNav />
      <div className="order-system__content">
        {routes.map((route, idx) => {
          return route.component && (
            <Route
              exact={route.exact}
              key={idx}
              path={match.url + route.path}
              render={props => (
                <route.component {...props} />
              )} />
          )
        })}
        {/* <Redirect exact="true" from="/" to={`${match.url}/home`}></Redirect> */}
      </div>
    </div>
  )
}

export default OrderSystem