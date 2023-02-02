// Methods
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// UI components
import { Loader, FlashMsg } from '../../components'
import { Table, Container, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
// Redux related imports
import { getMyOrders } from '../../actions/orderActions'

const UserOrdersScreen = ({ history }) => {
  // -- redux stores --
  const dispatch = useDispatch()
  const { loading, orders, error } = useSelector((state) => state.myOrders)

  useEffect(() => {
    if (orders && orders.length === 0) dispatch(getMyOrders())
    return () => axios.CancelToken.source().cancel()
  }, [dispatch, orders])

  const LocaleDate = (d) => {
    const date = new Date(d)
    return date.toLocaleDateString()
  }

  return (
    <Container>
      {loading ? (
        <Loader />
      ) : error ? (
        <FlashMsg variant='danger' permanent>
          {error}
        </FlashMsg>
      ) : (
        <>
          <h3 className='mb-5'>
            {orders ? 'Your Orders' : 'You do not have any orders Yet'}
          </h3>

          {orders && (
            <Table
              striped
              bordered
              hover
              responsive
              className='table-sm'
              style={{ textAlign: 'center' }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>PAID</th>
                  <th>DELIVERY STATUS</th>
                  <th>DELIVERY DATE</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <LinkContainer to={`/orders/${order._id}`}>
                        <Button variant='link'>{order._id}</Button>
                      </LinkContainer>
                    </td>
                    <td>
                      {order.paidAt
                        ? order.paidAt.substring(0, 10)
                        : 'undefined'}
                    </td>
                    <td>{order.totalPrice}</td>
                    <td>
                      <p
                        style={{
                          color: order.isDelivered ? 'green' : '#636669',
                        }}
                      >
                        {order.deliveryStatus}
                      </p>
                    </td>
                    <td>
                      {order.deliveredAt ? (
                        <p>{LocaleDate(order.deliveredAt)}</p>
                      ) : (
                        <p>N/A</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </Container>
  )
}

export default UserOrdersScreen
