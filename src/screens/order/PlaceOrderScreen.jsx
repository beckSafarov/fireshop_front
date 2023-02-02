// libraries
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// methods
import { Calculations } from '../../helpers/calculations'

// UI components
import { Loader, CheckOutSteps, FlashMsg } from '../../components'
import { Row, Col, ListGroup, Card, Image } from 'react-bootstrap'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link, withRouter } from 'react-router-dom'

// redux actions
import { createOrder } from '../../actions/orderActions'
import { getUserAddress } from '../../helpers/utilities'
import { cancelTokenConfig } from '../../helpers/rxConfigs'

const PlaceOrderScreen = ({ history }) => {
  // bringing redux related things
  const dispatch = useDispatch()
  const orderCreated = useSelector((state) => state.orderReducers)

  // variables
  const { userInfo } = useSelector((state) => state.userLogin)
  const { cartItems } = useSelector((state) => state.cart)
  const calcs = Calculations(cartItems)
  const loading = orderCreated.loading
  const error = orderCreated.error

  // hooks states
  const [sdkReady, setSdkReady] = useState(false)
  const [paymentErrorMessage, setPaymentErrorMessage] = useState('undefined')

  useEffect(
    () => {
      if (userInfo && !userInfo.shippingAddress) {
        history.push('/')
      }

      const addPaypalScript = async () => {
        try {
          const { data: clientId } = await axios.get(
            process.env.SERVER_URL+'/api/config/paypal',
            cancelTokenConfig
          )
          const script = document.createElement('script')
          script.type = 'text/javascript'
          script.async = true
          script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
          script.onload = () => setSdkReady(true)
          document.body.appendChild(script)
        } catch (err) {
          console.log(`Error happened while axios request: ${err.message}`)
        }
      }

      if (userInfo && !orderCreated.success) {
        !window.paypal ? addPaypalScript() : setSdkReady(true)
      } else if (orderCreated.success) {
        history.push(`/payment-success?id=${orderCreated.order._id}`)
      }

      return () => axios.CancelToken.source().cancel()
    },
    [userInfo, dispatch, orderCreated.success],
    history
  )

  const successPaymentHandler = (paymentResult) => {
    const paymentInfo = {
      ...paymentResult, //id and update_time
      Status: paymentResult.status,
      email_address: paymentResult.payer.email_address,
    }

    dispatch(
      createOrder({
        paymentMethod: 'Paypal',
        paymentResult: paymentInfo,
        taxPrice: calcs.taxPrice,
        shippingPrice: calcs.shippingPrice,
        totalPrice: calcs.totalPrice,
        paidAt: paymentResult.create_time,
      })
    )
  }

  const paymentErrorHandler = (error = 'payment failed') => {
    setPaymentErrorMessage(error)
  }

  const orderSummaryLabels = [
    'Subtotal',
    "Product's Price",
    'Shipping Price',
    'Tax Price',
    'Total Price',
  ]
  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <FlashMsg variant='danger' permanent>
          <>
            <h2 className='danger-text'>Payment Failed!</h2>
            <p>Error: {orderCreated.error || paymentErrorMessage}</p>
            {orderCreated.error && (
              <p className='mt-10'>
                This seems like a server error so please contact us at{' '}
                <a href='mailto:support@fireshop.com'>support@fireshop.com</a>{' '}
                with screenshot
              </p>
            )}
          </>
        </FlashMsg>
      ) : userInfo ? (
        <>
          <CheckOutSteps step={3} />
          <Row>
            <Col md={8}>
              <ListGroup variant='flush'>
                <h2 className='mb-4 text-center'>Order Details</h2>
                <ListGroup.Item>
                  <p>
                    <strong>Name: </strong>
                    {userInfo.name}
                  </p>
                  <p>
                    <strong>Email: </strong>
                    {userInfo.email}
                  </p>

                  <p>
                    <strong>Address: </strong>
                    {getUserAddress(userInfo.shippingAddress)}
                  </p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p>
                    <strong>Payment Method: </strong>
                    {'Paypal'}
                  </p>
                </ListGroup.Item>

                <ListGroup.Item>
                  <p>
                    <strong>Order items: </strong>
                  </p>
                  <ListGroup variant='flush'>
                    {cartItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              className='img-fluid img-rounded'
                            />
                          </Col>
                          <Col>
                            <Link to={`/product/${item._id}`}>{item.name}</Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} x {item.price} = ${item.qty * item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <h2 className='mb-4 text-center'>Order Summary</h2>
              <Card>
                <ListGroup variant='flush'>
                  {orderSummaryLabels.map((label, i) => (
                    <ListGroup.Item key={i}>
                      <Row>
                        <Col>{label}</Col>
                        <Col>
                          {i === orderSummaryLabels.length - 1 ? '= ' : '+ '}
                          {Object.values(calcs)[i]}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item>
                    {!orderCreated.isPaid && (
                      <ListGroup.Item>
                        {orderCreated.loading || !sdkReady ? (
                          <Loader />
                        ) : (
                          <PayPalButton
                            id='paypalButton'
                            amount={calcs.totalPrice}
                            onSuccess={successPaymentHandler}
                            onError={paymentErrorHandler}
                          />
                        )}
                      </ListGroup.Item>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <p>You should never see this!</p>
      )}
    </>
  )
}

export default withRouter(PlaceOrderScreen)
