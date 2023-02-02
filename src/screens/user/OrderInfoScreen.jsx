// methods
import { useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// methods
import { Calculations } from '../../helpers/calculations'

// UI components
import { Row, Col, ListGroup, Image, Container, Button } from 'react-bootstrap'
import {
  Loader,
  DeliveryProgress,
  UpdateDeliveryModal,
  Review,
} from '../../components'

//Redux actions
import { getOrderDetails } from '../../actions/orderActions'
import {
  ORDERS_LIST_PROPERTY_RESET as listReset,
  ORDER_UPDATE_RESET as detailsReset,
} from '../../constants'
import { getUserAddress } from '../../helpers/utilities'
import FlashMsg from '../../components/globals/FlashMsg'

const deliverySteps = ['Received', 'Packed', 'Shipped', 'Delivered']

const OrderInfoScreen = ({ match }) => {
  const dispatch = useDispatch()

  // redux stores
  const { loading, order, error, success, type } = useSelector(
    (state) => state.orderDetails
  )
  const calcs = Calculations(order.orderItems || [])
  const { userInfo } = useSelector((state) => state.userLogin)

  // hooks
  const [updateModal, setUpdateModal] = useState({})
  const [revModal, setRevModal] = useState({})
  const [flashMsg, setFlashMsg] = useState({})

  // variables
  const requestLoading = loading && type === 'request'

  useEffect(() => {
    order._id !== match.params.id && dispatch(getOrderDetails(match.params.id))

    if (success && type === 'update') {
      setFlashMsg({ variant: 'success', msg: 'Updated successfully' })
      setUpdateModal({ ...updateModal, display: false })
      dispatch({ type: detailsReset, payload: 'success' })
      dispatch({ type: listReset, payload: 'success' })
    }

    if (error) {
      setFlashMsg({ variant: 'danger', msg: error })
    }
    return () => axios.CancelToken.source().cancel()
  }, [dispatch, match, success, error, type])

  const UTCDate = (d) => {
    const date = new Date(d)
    return date.toUTCString()
  }

  const updateHandler = () => {
    setUpdateModal({
      display: true,
      _id: order._id,
      status: order.deliveryStatus,
    })
  }

  const revModalHandler = (_id) => {
    setRevModal({ display: true, _id, user: userInfo._id })
  }

  const canReview = (_id) =>
    userInfo.purchased.find((i) => i._id === _id && i.isDelivered)

  const orderInfoList = [
    { label: 'Order ID: ', body: order?._id },
    { label: 'Name: ', body: order?.user?.name },
    { label: 'Email: ', body: order?.user?.email },
    { label: 'Address: ', body: getUserAddress(order?.shippingAddress) },
    { label: 'Payment Method: ', body: order?.paymentMethod },
  ]

  return (
    <Container>
      <FlashMsg
        variant={flashMsg.variant}
        permanent={Boolean(error)}
        clearChildren={() => setFlashMsg({})}
      >
        {flashMsg.msg}
      </FlashMsg>
      <Loader hidden={!requestLoading} />
      {order?.user && (
        <Row>
          <UpdateDeliveryModal
            modal={updateModal}
            display={updateModal.display}
            data={updateModal}
            onClose={() => setUpdateModal({ display: false })}
          />
          {revModal.display && (
            <Review
              modal={revModal}
              onClose={() => setRevModal((m) => ({ ...m, display: false }))}
            />
          )}
          <Col md={6}>
            <>
              <h3 className='mb-4'>Order Info</h3>
              <ListGroup variant='flush'>
                {/* info about the order */}
                <ListGroup.Item>
                  {orderInfoList.map((info, i) => (
                    <p key={i}>
                      <strong>{info.label}</strong>
                      {info.body}
                    </p>
                  ))}
                </ListGroup.Item>
                {/* list of bought items */}
                <ListGroup.Item>
                  <p>Purchased Product(s)</p>
                  {order.orderItems.map((item) => (
                    <Row key={item._id}>
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
                      {canReview(item._id) && (
                        <Col>
                          <Button
                            type='button'
                            variant='outline-success'
                            size='sm'
                            onClick={() => revModalHandler(item._id)}
                          >
                            Review
                          </Button>
                        </Col>
                      )}
                    </Row>
                  ))}
                </ListGroup.Item>
                {/* order calculations */}
                <ListGroup.Item>
                  <Row>
                    <Col> Cumulative Products' Price </Col>
                    <Col>+ {calcs.productsPrice}</Col>
                  </Row>
                  <Row>
                    <Col> Shipping </Col>
                    <Col>+ {order.shippingPrice}</Col>
                  </Row>
                  <Row>
                    <Col> Tax </Col>
                    <Col>+ {order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      {' '}
                      <h5>Total</h5>{' '}
                    </Col>
                    <Col>
                      <h5>{order.totalPrice}</h5>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </>
          </Col>
          <Col md={6}>
            <h3 className='mb-4'>Order Status</h3>
            <div className='delivery-progress-container'>
              <DeliveryProgress
                width={500}
                height={100}
                progress={deliverySteps.indexOf(order.deliveryStatus)}
              />
            </div>
            <ListGroup variant='flush'>
              {order.isDelivered ? (
                <>
                  <ListGroup.Item>
                    <Row>
                      <Col>Delivered</Col>
                      <Col>
                        <i
                          style={{ color: 'green' }}
                          className='fas fa-check'
                        ></i>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Delivery Date</Col>
                      <Col>{UTCDate(order.deliveredAt)}</Col>
                    </Row>
                  </ListGroup.Item>
                </>
              ) : (
                <>
                  <ListGroup.Item>
                    <Row>
                      <Col>Delievered</Col>
                      <Col>
                        <i
                          style={{ color: 'red' }}
                          className='fas fa-times'
                        ></i>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Expected Delivery Date</Col>
                      <Col>some day</Col>
                    </Row>
                  </ListGroup.Item>
                </>
              )}
              {userInfo.isAdmin && (
                <ListGroup.Item>
                  <Button
                    title='Update Delivery Status'
                    variant='info'
                    size='sm'
                    onClick={updateHandler}
                    block
                  >
                    <i className='fas fa-edit'></i>
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default withRouter(OrderInfoScreen)
