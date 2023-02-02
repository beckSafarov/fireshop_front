import * as cs from '../constants.js'
import produce from 'immer'

export const orderCreateReducer = produce((draft = { order: {} }, action) => {
  switch (action.type) {
    case cs.ORDER_CREATE_REQUEST:
      return { loading: true, order: {} }
    case cs.ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload }
    case cs.ORDER_CREATE_FAIL:
      return { loading: false, order: {}, error: action.payload }
    default:
      return draft
  }
})

export const ordersFilterReducer = produce((draft = { orders: [] }, action) => {
  switch (action.type) {
    case cs.ORDERS_FILTER_REQUEST:
      return { loading: true }
    case cs.ORDERS_FILTER_SUCCESS:
      return { loading: false, success: true, orders: action.payload }
    case cs.ORDERS_FILTER_FAILURE:
      return { loading: false, error: action.payload }
    case cs.ORDERS_FILTER_RESET:
      return {}
    default:
      return draft
  }
})

export const orderDetailsReducer = produce((draft = { order: {} }, action) => {
  const loadingState = { ...draft, loading: true }
  const successState = { loading: false, success: true, order: action.payload }
  switch (action.type) {
    case cs.ORDER_DETAILS_REQUEST:
      return { ...loadingState, type: 'request' }
    case cs.ORDER_DETAILS_SUCCESS:
      return { ...successState, type: 'request' }
    case cs.ORDER_DETAILS_FAIL:
    case cs.ORDER_UPDATE_FAIL:
      return { ...draft, loading: false, error: action.payload }
    case cs.ORDER_DETAILS_RESET:
      return {}
    case cs.ORDER_UPDATE_REQUEST:
      return { ...loadingState, type: 'update' }
    case cs.ORDER_UPDATE_SUCCESS:
      return { ...successState, order: action.payload, type: 'update' }
    case cs.ORDER_UPDATE_RESET:
      draft[action.payload] = null
      break
    default:
      return draft
  }
})

/**
 * @access public
 */
export const myOrdersReducer = produce((draft = { orders: [] }, action) => {
  switch (action.type) {
    case cs.MY_ORDERS_REQUEST:
      return { loading: true }
    case cs.MY_ORDERS_SUCCESS:
      return { loading: false, success: true, orders: action.payload }
    case cs.MY_ORDERS_FAIL:
      return { loading: false, error: action.payload }
    case cs.MY_ORDERS_RESET:
      return { orders: [] }
    default:
      return draft
  }
})

/**
 * @access public && private
 */
export const ordersListReducer = produce((draft = { orders: [] }, action) => {
  const successState = { loading: false, success: true }
  switch (action.type) {
    case cs.ORDERS_LIST_REQUEST:
      return { ...draft, loading: true }
    case cs.ORDERS_LIST_SUCCESS:
      return { ...successState, orders: action.payload }
    case cs.ORDERS_LIST_FAILURE:
      return { loading: false, error: action.payload }
    case cs.ORDERS_LIST_UPDATE_SUCCESS:
      const updatedOrder = action.payload
      const ordersUpdated = draft.orders.map((order) =>
        order._id === updatedOrder._id
          ? {
              ...order,
              isDelivered: updatedOrder.isDelivered,
              deliveryStatus: updatedOrder.deliveryStatus,
            }
          : order
      )
      return {
        ...successState,
        orders: ordersUpdated,
        type: 'update',
      }
    case cs.ORDERS_LIST_RESET:
      return {}
    case cs.ORDERS_LIST_PROPERTY_RESET:
      draft[action.payload] = null
      break
    default:
      return draft
  }
})
