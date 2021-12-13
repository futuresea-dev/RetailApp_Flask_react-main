import { lazy } from 'react';
import { withRouter } from 'react-router-dom';
import OrderSystem from './components/OrderSystem';

const Home = lazy(() => import('./views/home/Home'));
const Terms = lazy(() => import('./views/dashboard/Terms'))
const Privacy = lazy(() => import('./views/dashboard/Privacy'))
const PersionalSetting = lazy(() => import('./views/setting/PersionalSetting'))

const AdminLinkManage = lazy(() => import('./views/admin/AdminLinkManage'));
const AdminIPManage = lazy(() => import('./views/admin/AdminIPManage'));
const AdminUsers = lazy(() => import('./views/admin/AdminUsers'));
const AdminDBManage = lazy(() => import('./views/admin/AdminDBManage'));
const AdminTypeManage = lazy(() => import('./views/admin/AdminTypeManage'));
const AdminTypeEdit = lazy(() => import('./views/admin/AdminTypeEdit'));
const AdminProductReviews = lazy(() => import('./views/admin/AdminProductReviews'));
const AdminReviewEdit = lazy(() => import('./views/admin/AdminReviewEdit'));
const AdminShippingManage = lazy(() => import('./views/admin/AdminShippingManage'));
const AdminProductManage = lazy(() => import('./views/admin/AdminProductManage'));
const AdminProductEdit = lazy(() => import('./views/admin/AdminProductEdit'));
const AdminShippingZoneEdit = lazy(() => import('./views/admin/AdminShippingZoneEdit'));
const AdminOrderManage = lazy(() => import('./views/admin/AdminOrderManage'));
const AdminOrderEdit = lazy(() => import('./views/admin/AdminOrderEdit'));

const AdminDashboard1 = lazy(() => import('./views/admin/Dashboard1'));
const AdminDashboard2 = lazy(() => import('./views/admin/Dashboard2'));
const AdminDashboard3 = lazy(() => import('./views/admin/Dashboard3'));
const AdminDashboard4 = lazy(() => import('./views/admin/Dashboard4'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/home', name: 'Home', component: Home },
  { path: '/setting', name: 'Setting', component: PersionalSetting },
  { path: '/users', name: 'Users', component: AdminUsers },
  { path: '/links', name: 'Link Manage', component: AdminLinkManage},
  { path: '/ip', name: 'IP Manage', component: AdminIPManage },
  { path: '/types', name: 'Type Manage', component: AdminTypeManage},
  { path: '/type', name: 'Type Edit', component: AdminTypeEdit},
  { path: '/reviews', name: 'Product Reviews', component: AdminProductReviews},
  { path: '/review', name: 'Review Edit', component: AdminReviewEdit},
  { path: '/products', name: 'Product Management', component: AdminProductManage},
  { path: '/product', name: 'Product Edit', component: AdminProductEdit},
  { path: '/shipping', name: 'Shipping Management', component: AdminShippingManage},
  { path: '/shipping_zone', name: 'Shipping Zone Edit', component: AdminShippingZoneEdit},
  { path: '/db-manage', name: 'Link Manage', component: AdminDBManage},
  { path: '/dashboard-1', name: 'Dashboard 1', component: AdminDashboard1, fullwidth: true,},
  { path: '/dashboard-2', name: 'Dashboard 2', component: AdminDashboard2, fullwidth: true,},
  { path: '/dashboard-3', name: 'Dashboard 3', component: AdminDashboard3, fullwidth: true,},
  { path: '/dashboard-4', name: 'Dashboard 4', component: AdminDashboard4, fullwidth: true,},
  { path: '/order-manage', name: 'Order Manage', component: AdminOrderManage,},
  { path: '/order-new', name: 'New Order', component: AdminOrderEdit, fullwidth: false,},
  { path: '/order', exact: false, name: 'Order', component: withRouter(OrderSystem), fullwidth: true,},
];

export default routes;
