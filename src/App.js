// Methods
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

//redux actions
import { getMe } from './actions/userActions'

// UI components
import { Container } from 'react-bootstrap'
import { Header, Footer, Spinner, ProtectedRoute } from './components'
import { BrowserRouter as Router, Route } from 'react-router-dom'

// Screens
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/auth/LoginScreen'
import RegisterScreen from './screens/auth/RegisterScreen'
import ProfileScreen from './screens/user/ProfileScreen'
import ShippingScreen from './screens/order/ShippingScreen'
import PaymentScreen from './screens/payment/PaymentScreen'
import PlaceOrderScreen from './screens/order/PlaceOrderScreen'
import PaymentSuccess from './screens/payment/PaymentSuccess'
import PaymentFailure from './screens/payment/PaymentFailure'
import UserOrdersScreen from './screens/user/UserOrdersScreen'
import OrderInfoScreen from './screens/user/OrderInfoScreen'
import ShaddressScreen from './screens/user/ShaddressScreen'
import testScreen from './screens/testScreen'
import { getCart } from './helpers/cartLCS'
import { addToCart } from './actions/cartActions'
import UserListScreen from './screens/admin/UserListScreen'
import ProductListScreen from './screens/admin/ProductListScreen'
import ProductEditScreen from './screens/admin/ProductEditScreen'
import OrdersListScreen from './screens/admin/OrdersListScreen'
import SearchScreen from './screens/SearchScreen'
import Meta from './components/Meta'

const publicRoutes = [
  { path: '/', component: HomeScreen, exact: true },
  { path: '/page/:pageNumber', component: HomeScreen },
  { path: '/search', component: SearchScreen },
  { path: '/product/:id', component: ProductScreen },
  { path: '/cart/:id?', component: CartScreen },
]

const protectedRoutes = [
  { path: '/register', component: RegisterScreen, unloggedOnly: true },
  { path: '/signin', component: LoginScreen, unloggedOnly: true },
  {
    path: '/signin?redirect=:redirect',
    component: LoginScreen,
    unloggedOnly: true,
  },
  { path: '/profile', component: ProfileScreen },
  { path: '/address', component: ShaddressScreen },
  { path: '/myorders', component: UserOrdersScreen, exact: true },
  { path: '/orders/:id', component: OrderInfoScreen },
  { path: '/placeorder', component: PlaceOrderScreen },
  { path: '/shipping', component: ShippingScreen },
  { path: '/payment', component: PaymentScreen },
  { path: '/payment-success', component: PaymentSuccess },
  { path: '/payment-failure', component: PaymentFailure },
  { path: '/admin/userslist', component: UserListScreen, adminOnly: true },
  {
    path: '/admin/productlist',
    component: ProductListScreen,
    adminOnly: true,
    exact: true,
  },
  {
    path: '/admin/productlist/page/:pageNumber',
    component: ProductListScreen,
    adminOnly: true,
    exact: true,
  },
  {
    path: '/admin/productedit/:id',
    component: ProductEditScreen,
    adminOnly: true,
  },
  { path: '/admin/orderslist', component: OrdersListScreen, adminOnly: true },
]

const App = () => {
  const dispatch = useDispatch()
  const { loading: cartLoading } = useSelector((state) => state.cart)
  const { loading: userLoading, userInfo } = useSelector(
    (state) => state.userLogin
  )
  const lcc = getCart()
  const loading = userLoading || cartLoading || false

  useEffect(() => {
    userInfo === null && dispatch(getMe())
    if (userInfo && lcc.length > 0) {
      dispatch(addToCart(lcc, true, true))
    }
    return () => axios.CancelToken.source().cancel()
  }, [dispatch, userInfo])

  return (
    <Router>
      <Meta />
      <Header />
      <main className='py-3'>
        <Spinner hidden={!loading && window.navigator.onLine} />
        <Container id='container' hidden={loading}>
          {publicRoutes.map((route, i) => (
            <Route
              key={i}
              path={route.path}
              component={route.component}
              exact={route.exact}
            />
          ))}

          {protectedRoutes.map((route, i) => (
            <ProtectedRoute
              key={i}
              path={route.path}
              component={route.component}
              unloggedOnly={route.unloggedOnly}
              exact={route.exact}
              adminOnly={route.adminOnly}
            />
          ))}
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
