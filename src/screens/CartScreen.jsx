// -- methods & libraries --
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
// -- helpers --
import { Calculations } from '../helpers/calculations'
import * as cartLcs from '../helpers/cartLCS'
import * as qtyLcs from '../helpers/qtyLCS'

// -- ui components --
import { Row, Col, ListGroup, Button, Card } from 'react-bootstrap'
import {
  CartItem,
  EmptyCart,
  Spinner,
  ConfirmModal,
  Exceptional,
} from '../components'

// -- redux related imports --
import { qtyReset, removeItem } from '../actions/cartActions'
import { CART_PROPERTY_RESET as cartReset } from '../constants'
import FlashMsg from '../components/globals/FlashMsg'
import { withRouter } from 'react-router-dom'
import Meta from '../components/Meta'

const CartScreen = ({ history }) => {
  const dispatch = useDispatch()
  // hooks
  const [cartItems, setCartItems] = useState(cartLcs.getCart())
  const [flashMsg, setFlashMsg] = useState('')
  const [confirmModal, setConfirmModal] = useState({})

  // redux stores and related stuff
  const { userInfo: logged } = useSelector((state) => state.userLogin)
  const cart = useSelector((state) => state.cart)
  const { loading: cartLoading, error } = cart

  // variables
  const updating = cartItems && cartLoading
  const calcs = Calculations(cartItems)

  useEffect(() => {
    if (cart) setCartItems(cart.cartItems)
    if (error) {
      setFlashMsg(error)
      dispatch({ type: cartReset, payload: 'error' })
    }

    return () => axios.CancelToken.source().cancel()
  }, [dispatch, error, cart])

  const handleConfirmDelete = (id, name) => {
    const confMsg = `Are you sure to delete ${name} from your cart?`
    setConfirmModal({
      ...confirmModal,
      display: true,
      message: confMsg,
      _id: id,
    })
  }

  const handleQtyReset = (id, qty) =>
    dispatch(qtyReset({ _id: id, qty: Number(qty) }, logged))

  const handleCheckout = () =>
    history.push(logged ? '/shipping' : '/signin?redirect=shipping')

  const handleProceedModal = (e) => {
    e.preventDefault()
    handleHideModal()
    dispatch(removeItem(confirmModal._id, logged))
  }

  const handleHideModal = () =>
    setConfirmModal({ ...confirmModal, display: false })

  return (
    <>
      {cartItems ? (
        <>
          <EmptyCart hidden={cartItems.length !== 0} />
          <Row hidden={cartItems.length === 0}>
            <Spinner hidden={!updating} />
            <ConfirmModal
              active={confirmModal.display}
              heading={confirmModal.heading}
              message={confirmModal.message}
              confirmHandler={handleProceedModal}
              hideHandler={handleHideModal}
              proceedText='Delete'
              primaryVariant='danger'
            />
            <Col md={8}>
              <h1>Shopping Cart</h1>
              <FlashMsg variant='danger' permanent>
                {flashMsg}
              </FlashMsg>
              <ListGroup variant='flush'>
                {cartItems.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    newQty={qtyLcs.getQts()[item._id]}
                    qtyResetHandler={handleQtyReset}
                    removeFromCart={handleConfirmDelete}
                  />
                ))}
              </ListGroup>
            </Col>
            <Col md={4}>
              {calcs.subtotal !== 0 && (
                <Card>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <h4>Subtotal: {calcs.subtotal}</h4>
                      <h4>Total price: ${calcs.productsPrice}</h4>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Button
                        type='button'
                        className='btn-block'
                        disabled={cartItems.length === 0}
                        onClick={handleCheckout}
                      >
                        Proceed to Checkout
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              )}
            </Col>
          </Row>
        </>
      ) : (
        <Exceptional />
      )}
    </>
  )
}

export default withRouter(CartScreen)
