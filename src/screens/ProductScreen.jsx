// -- CORE LIBRARIES --
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// -- Helpers --
import * as lcs from '../helpers/cartLCS'

// -- UI COMPONENTS --
import { Row, Col, Image, ListGroup, Button, Form } from 'react-bootstrap'
import { Rating, CountOptions, Spinner } from '../components'

// -- REDUX ACTIONS
import { listProductDetails as getProduct } from '../actions/productActions'
import { addToCart, buyNowAction } from '../actions/cartActions'
import { CART_PROPERTY_RESET as cartReset } from '../constants'
import timeSince from '../helpers/timeSince'
import { pluralize } from '../helpers/utilities'
import FlashMsg from '../components/globals/FlashMsg'
import { withRouter } from 'react-router-dom'
import Meta from '../components/Meta'

const ProductScreen = ({ match, history }) => {
  // -- hooks --
  const [qty, setQty] = useState(1)
  const [flashMsg, setFlashMsg] = useState({})

  // -- bringing redux stores --
  const dispatch = useDispatch()
  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails
  const { userInfo } = useSelector((state) => state.userLogin)
  const {
    successType,
    error: cartError,
    message: cartMessage,
  } = useSelector((state) => state.cart)
  const logged = userInfo ? true : false
  const dataExists = product && product.name && product._id === match.params.id

  useEffect(() => {
    !dataExists && dispatch(getProduct(match.params.id))

    if (successType) {
      switch (successType) {
        case 'add':
          setFlashMsg({ variant: 'success', msg: cartMessage })
          break
        case 'buyNow':
          history.push(
            logged
              ? userInfo.shippingAddress
                ? '/placeorder'
                : '/shipping'
              : '/signin?redirect=shipping'
          )
          break
      }
      dispatch({ type: cartReset, payload: 'successType' })
    }

    if (cartError) {
      setFlashMsg({ variant: 'danger', msg: cartError })
      dispatch({ type: cartReset, payload: 'error' })
    }

    return () => axios.CancelToken.source().cancel()
  }, [dispatch, match, successType, cartError])

  const handleAddToCart = () => {
    const more = lcs.have(product) ? 'more' : ''
    dispatch(addToCart({ ...product, qty: Number(qty) }, logged))

    if (!logged) {
      const text = `You added ${qty} ${more} ${product.name}(s) to your shopping cart`
      setFlashMsg({ variant: 'success', msg: text })
    }
  }

  const handleBuyNow = () => {
    dispatch(buyNowAction(product, Number(qty), logged))
  }

  const sendBack = () => history.goBack()

  const btns = [
    {
      label: 'Add to Cart',
      variant: 'outline-primary',
      onClick: handleAddToCart,
    },
    {
      label: 'Buy Now',
      variant: 'primary',
      onClick: handleBuyNow,
    },
  ]

  return (
    <>
      <Meta title={product?.name} />
      <div className='btn btn-light my-3 rounded' onClick={sendBack}>
        <i className='fas fa-arrow-left fa-2x'></i>
      </div>
      <FlashMsg
        variant={flashMsg.variant}
        clearChildren={() => setFlashMsg({})}
      >
        {flashMsg.msg}
      </FlashMsg>
      <Spinner hidden={!loading || product} />
      {!loading && product && !error && (
        <>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={pluralize(product.numReviews)}
                  />
                </ListGroup.Item>

                <ListGroup.Item>
                  <h5>Description</h5>
                  {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <ListGroup>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      <strong>
                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item hidden={product.countInStock === 0}>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control
                        as='select'
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      >
                        <CountOptions countInStock={product.countInStock} />
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  {btns.map((btn, i) => (
                    <Row className='mb-1' key={i}>
                      <Button
                        onClick={btn.onClick}
                        variant={btn.variant}
                        type='button'
                        disabled={product.countInStock < 1}
                        block
                      >
                        {btn.label}
                      </Button>
                    </Row>
                  ))}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2 className='mt-20'>Reviews</h2>
              <div className='py-4'>
                <ListGroup>
                  {product.reviews.map((r) => (
                    <ListGroup.Item key={r._id} className='rounded-btn'>
                      <div className='comment-top-row'>
                        <div>
                          <strong>{r.name}</strong>
                          <small style={{ display: 'block' }}>
                            {timeSince(r.updatedAt || r.createdAt)}
                          </small>
                        </div>
                        <Rating value={r.rating} />
                      </div>

                      <p className='mt-20'>{r.comment}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default withRouter(ProductScreen)
