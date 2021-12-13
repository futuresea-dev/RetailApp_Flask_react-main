import { createStore } from 'redux'

const initialState = {
  sidebarShow: false,
  asideShow: false,
  darkMode: true,
  isAdmin: false,
  isEmployee: false,
  isLogin: false,
  openSignup: false,
  openSignin: false,
  openEmailVerification: false,
  popupForCurrency: false,
  openAddPayment: false,
  forgotPassword1: false,
  forgotPassword2: false,
  user: {},
  categories: [],
  brands: [],
  isLoading: false,
  currentCategory: false,
  cartItems: [{product: {name: 'Hao', price: 10}, qty: 10}],
  productTypes: [],
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return {...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store