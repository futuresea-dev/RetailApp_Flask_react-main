import OsHomePage from './pages/OsHomePage'
import OsBrandPage from './pages/OsBrandPage'
import OsCategoryPage from './pages/OsCategoryPage'
import OsProductTypePage from './pages/OsProductTypePage'
import OsProductPage from './pages/OsProductPage'
import OsCheckoutPage from './pages/OsCheckoutPage'
import OsProductListPage from './pages/OsProductListPage'
import OsTypeListPage from './pages/OsTypeListPage'
import { withRouter } from 'react-router-dom'

const routes = [
  { path: '', name: 'Home', component: withRouter(OsHomePage), exact: true },
  { path: '/products', name: 'Product List', component: withRouter(OsProductListPage), exact: true },
  { path: '/types', name: 'Product Types', component: withRouter(OsTypeListPage), exact: true },
  // { path: '/products/:category', name: 'Category', component: withRouter(OsCategoryPage), exact: true },
  { path: '/product/:sku', name: 'Product', component: withRouter(OsProductPage), exact: true },
  // { path: '/brands/:brand', name: 'Brand', component: OsBrandPage },
  { path: '/type/:type', name: 'Product Type', component: OsProductTypePage },
  { path: '/checkout', name: 'Checkout', component: OsCheckoutPage },
]

export default routes