import { useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { getOrderDetails } from '../../actions/orderActions'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, ListGroup, Image, Container } from 'react-bootstrap'
import axios from 'axios'
import { Loader, FlashMsg } from '../../components'
import { getUserAddress, isEmptyObj } from '../../helpers/utilities'
import { CART_REMOVE_ITEMS } from '../../constants'

const PaymentSuccess = ({ history, location }) => {
  const dispatch = useDispatch()
  const id = location.search.split('=')[1]
  const { loading, order, error } = useSelector((state) => state.orderDetails)

  useEffect(() => {
    if (isEmptyObj(order)) {
      dispatch(getOrderDetails(id))
    } else {
      dispatch({
        type: CART_REMOVE_ITEMS,
        payload: {
          cartItems: order.orderItems,
        },
      })
    }
    return () => axios.CancelToken.source().cancel()
  }, [dispatch, order])

  const transactionInfo = [
    { label: 'Order ID', body: order?.paymentResult?.id },
    { label: 'Name', body: order?.user?.name },
    { label: 'Email', body: order?.paymentResult?.email_address },
    {
      label: 'Address',
      body: getUserAddress(order?.shippingAddress),
    },
    { label: 'Payment Method', body: order?.paymentMethod },
    { label: 'Payment Date', body: order?.paidAt },
  ]

  return (
    <>
      <Loader hidden={!loading} />
      <FlashMsg variant='danger' permanent>
        {error}
      </FlashMsg>
      {!isEmptyObj(order) && (
        <Container>
          <ListGroup variant='flush'>
            <h2 className='mb-4 text-center'>Payment Was Successful!</h2>
            <ListGroup.Item>
              {transactionInfo.map((transaction, i) => (
                <p key={i}>
                  <strong>{transaction.label} </strong>
                  {transaction.body}
                </p>
              ))}
            </ListGroup.Item>
            <ListGroup.Item>
              <p>
                <strong>Order items: </strong>
              </p>
              <ListGroup variant='flush'>
                {order.orderItems?.map((item, index) => (
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
            <ListGroup.Item>
              <p>
                <strong>Total Paid: </strong>
                {order.totalPrice}
              </p>
            </ListGroup.Item>
          </ListGroup>
          <div className='mt-4'>
            <p>
              Your order should be delivered within 2 weeks. You can track the
              progress in your <strong>Profile</strong>,{' '}
              <strong>My Orders</strong> Section
            </p>
          </div>
        </Container>
      )}
    </>
  )
}

export default withRouter(PaymentSuccess)
// const id = new URLSearchParams(useLocation().search).get('id');
