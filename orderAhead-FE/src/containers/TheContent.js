import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch,
  useLocation
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'

// routes config
import routes from '../routes'
import { useFullwidth } from '../contexts/ThemeContext'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)


const TheContent = (props) => {
  const location = useLocation()
  const sanitizeTitle = (value) => value.replace(/^\/|\/$/g, '').replace('/', '-')
  const pageClass = sanitizeTitle(location.pathname)

  let boxLayoutClass = ' main-padding'

  let fullwidthClasses = routes.filter(route => route.fullwidth)

  fullwidthClasses = fullwidthClasses.map((route, idx) => sanitizeTitle(route.path))

  if (fullwidthClasses.some(item => -1 !== pageClass.indexOf(item)))
    boxLayoutClass = ' fullwidth'

  if (pageClass == 'order-new' || pageClass == 'order-manage') {
    boxLayoutClass = ' main-padding'
  }

  return (
    <main className={'c-main route-'+pageClass+boxLayoutClass}>
      <CContainer fluid>
        {/* <Suspense fallback={loading}> */}
          <Switch>
            {routes.map((route, idx) => {
              return route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={props => (
                    <CFade>
                      <route.component {...props} />
                    </CFade>
                  )} />
              )
            })}
            <Redirect from="/" to="/home" />
          </Switch>
        {/* </Suspense> */}
      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)
