import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import * as productReducers from './reducers/productReducers.js'
import * as cartReducers from './reducers/cartReducers.js'
import * as userReducers from './reducers/userReducers'
import * as orderReducers from './reducers/orderReducers'
import * as adminReducers from './reducers/adminReducers'
import { getCart } from './helpers/cartLCS.js'

//this is the root reducer that includes all reducers
const reducer = combineReducers({
  productList: productReducers.productListReducer,
  productSearchStore: productReducers.productSearchReducer,
  productDetails: productReducers.productDetailsReducer,
  productReviewStore: productReducers.productReviewReducer,
  productTopRating: productReducers.productTopReducer,
  cart: cartReducers.cartReducer,
  userLogin: userReducers.userLoginReducer,
  userRegister: userReducers.userRegisterReducer,
  userDetailsUpdate: userReducers.updateUserDetailsReducer,
  shaddress: userReducers.ShaddressReducer,
  userList: adminReducers.userListReducer,
  adminUserDelete: adminReducers.adminUserDeleteReducer,
  adminUserUpdate: adminReducers.adminUserUpdateReducer,
  adminSearchUserStore: adminReducers.searchUserReducer,
  imgUploadStore: adminReducers.imgUploadReducer,
  ordersListStore: orderReducers.ordersListReducer,
  ordersFilterStore: orderReducers.ordersFilterReducer,
  orderReducers: orderReducers.orderCreateReducer,
  orderDetails: orderReducers.orderDetailsReducer,
  myOrders: orderReducers.myOrdersReducer,
})

//getting existing items from the LC
const paymentMethod = JSON.parse(localStorage.getItem('paymentMethod'))

//this is the preloader that gets loaded in the build time
const initialState = {
  cart: {
    cartItems: getCart(),
    paymentMethod: paymentMethod || {},
  },
  userLogin: { userInfo: null },
}

//this is the list of middleware that are fired when an action is dispatched
const middleware = [thunk]
//thunk is a middleware that contacts with the server

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
