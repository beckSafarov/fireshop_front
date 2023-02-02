// Methods
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// UI components
import {
  UpdateDeliveryModal,
  Spinner,
  OrdersFilter,
  OrdersSort,
  FlashMsg,
} from '../../components'
import {
  Table,
  Container,
  Button,
  ButtonGroup,
  Collapse,
  Fade,
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
// Redux related imports
import {
  getAllOrders,
  getFilteredOrders as filter,
} from '../../actions/orderActions'
import {
  ORDERS_FILTER_RESET,
  ORDERS_LIST_PROPERTY_RESET as orderPropReset,
} from '../../constants'
import { initSortVals } from '../../helpers/sortLCS'

const querify = (sortVals) => {
  let query = '?sort=true&'
  sortVals.forEach((val, i) => {
    query += `${val.sort}=${val.type}${i < sortVals.length - 1 ? '&' : ''}`
  })
  return query
}

const tableHeadings = [
  'id',
  'user',
  'date',
  'paid',
  'delivery status',
  'delivery date',
]

const OrdersListScreen = () => {
  const dispatch = useDispatch()

  const [modal, setModal] = useState({})
  const [flashMsg, setFlashMsg] = useState({})
  const [selectedBtn, setSelectedBtn] = useState(1)
  const [show, setShow] = useState({ sort: true })
  const [orders, setOrders] = useState([])

  // -- redux stores --
  // all orders
  const ordersListStore = useSelector((state) => state.ordersListStore)
  const {
    loading: listLoading,
    orders: allOrders,
    success: allOrdersLoaded,
    type,
    error,
  } = ordersListStore

  // filtered orders
  const {
    loading: filterLoading,
    orders: filteredOrders,
    error: filterFailed,
  } = useSelector((state) => state.ordersFilterStore)

  // one order
  const updated = allOrdersLoaded && type === 'update'
  const { loading: updateLoading } = useSelector((state) => state.orderDetails)
  const loading = listLoading || updateLoading || filterLoading
  const sortQuery = initSortVals(0) ? querify(initSortVals()) : ''

  const filterOn = filteredOrders && filteredOrders.length > 0

  useEffect(() => {
    if (allOrdersLoaded) {
      setOrders(allOrders)
      dispatch({ type: orderPropReset, payload: 'success' })
    }

    if (orders.length < 1) dispatch(getAllOrders(sortQuery))

    if (updated) {
      setFlashMsg({ variant: 'success', msg: 'Updated successfully' })
      setModal({})
      dispatch({ type: orderPropReset, payload: 'type' })
    }

    if (filterOn) setOrders(filteredOrders)

    if (filterFailed) {
      setFlashMsg({ variant: 'danger', msg: filterFailed })
      dispatch({ type: ORDERS_FILTER_RESET })
    }

    return () => axios.CancelToken.source().cancel()
  }, [dispatch, updated, orders, allOrdersLoaded, filterOn, filterFailed])

  const handleUpdate = (order) => {
    setModal({
      display: true,
      _id: order._id,
      status: order.deliveryStatus,
    })
  }

  const LocaleDate = (d) => {
    const date = new Date(d)
    return date.toLocaleString()
  }

  const handleFilter = (q) => dispatch(filter(q))

  const handleFilterClear = () => {
    allOrders ? setOrders(allOrders) : dispatch(getAllOrders())
    setShow({ sort: true })
    dispatch({ type: ORDERS_FILTER_RESET })
  }

  const handleSort = (sortVals) => {
    dispatch(getAllOrders(querify(sortVals)))
  }

  const handleMenuClick = (e) => {
    const { id } = e.target
    const [sort, filter] = [true, true]
    setShow(id == 1 ? { sort } : { filter })
    setSelectedBtn(id)
  }

  return (
    <Container>
      <h3 className='mb-3'>All Orders</h3>
      <Spinner hidden={!loading} />
      {modal.display && (
        <UpdateDeliveryModal
          modal={modal}
          onClose={() => setModal((m) => ({ ...m, display: false }))}
        />
      )}

      <div className='menu-row'>
        <ButtonGroup className='menu-row-left'>
          {['sort', 'filter'].map((btn, i) => (
            <Button
              variant='dark'
              id={i + 1}
              key={i}
              disabled={selectedBtn === i + 1}
              onClick={handleMenuClick}
            >
              {btn}
            </Button>
          ))}
        </ButtonGroup>
        <div className='menu-row-right'>
          <Fade in={filterOn}>
            <Button
              type='button'
              variant='light'
              className='rounded'
              onClick={handleFilterClear}
            >
              <i
                style={{ fontSize: '20px', color: '#808080' }}
                className='fas fa-times'
              ></i>
            </Button>
          </Fade>
        </div>
      </div>
      <Collapse in={show.sort}>
        <div className='py-2'>
          <OrdersSort onSubmit={handleSort} />
        </div>
      </Collapse>

      <Collapse in={show.filter}>
        <div className='py-2'>
          <OrdersFilter onSubmit={handleFilter} />
        </div>
      </Collapse>
      <FlashMsg
        variant={flashMsg.variant || 'danger'}
        clearChildren={() => setFlashMsg({})}
      >
        {flashMsg.msg || error}
      </FlashMsg>
      <Table striped bordered hover responsive className='table-sm'>
        <thead>
          <tr>
            {tableHeadings.map((t, i) => (
              <th key={i}>{t.toLocaleUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody style={{ textAlign: 'center' }}>
          {orders &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <LinkContainer to={`/orders/${order._id}`}>
                    <Button variant='link'>{order._id}</Button>
                  </LinkContainer>
                </td>
                <td>{order.user.name}</td>
                <td>
                  {order.paidAt ? order.paidAt.substring(0, 10) : 'undefined'}
                </td>
                <td>${order.totalPrice}</td>
                <td>
                  <p
                    title='update status'
                    onClick={() => handleUpdate(order)}
                    className='simple-link'
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
    </Container>
  )
}

export default OrdersListScreen
