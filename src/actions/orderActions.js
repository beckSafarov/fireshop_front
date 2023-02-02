import * as cs from '../constants.js'
import axios from 'axios'
import { axiosConfig, config } from '../helpers/axiosConfigs'
import { getErrMessage } from '../helpers/utilities.js'

export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({ type: cs.ORDER_CREATE_REQUEST })

    const { data } = await axios.post(process.env.SERVER_URL+'/api/orders/addorder', order, config)

    dispatch({
      type: cs.ORDER_CREATE_SUCCESS,
      payload: data.createdOrder,
    })
  } catch (err) {
    dispatch({
      type: cs.ORDER_CREATE_FAIL,
      payload: getErrMessage(err),
    })
  }
}

export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: cs.ORDER_DETAILS_REQUEST })

    const { data } = await axios.get(`${process.env.SERVER_URL}/api/orders/${id}`, axiosConfig)

    dispatch({
      type: cs.ORDER_DETAILS_SUCCESS,
      payload: data.order,
    })
  } catch (err) {
    dispatch({
      type: cs.ORDER_DETAILS_FAIL,
      payload: getErrMessage(err),
    })
  }
}

export const getMyOrders = () => async (dispatch) => {
  try {
    dispatch({ type: cs.MY_ORDERS_REQUEST })

    const { data } = await axios.get(`${process.env.SERVER_URL}/api/orders/myorders`, axiosConfig)

    const orders = data.orders.length > 0 ? data.orders : null

    dispatch({ type: cs.MY_ORDERS_SUCCESS, payload: orders })
  } catch (err) {
    dispatch({
      type: cs.MY_ORDERS_FAIL,
      payload: getErrMessage(err),
    })
  }
}

export const getAllOrders =
  (query = '') =>
  async (dispatch) => {
    try {
      dispatch({ type: cs.ORDERS_LIST_REQUEST })

      const { data } = await axios.get(`${process.env.SERVER_URL}/api/orders${query}`, axiosConfig)

      if (query) console.log(data.orders.map((val) => val.totalPrice))

      dispatch({
        type: cs.ORDERS_LIST_SUCCESS,
        payload: data.orders,
      })
    } catch (err) {
      dispatch({
        type: cs.ORDERS_LIST_FAILURE,
        payload: getErrMessage(err),
      })
    }
  }

export const getFilteredOrders =
  (query = '') =>
  async (dispatch) => {
    try {
      dispatch({ type: cs.ORDERS_FILTER_REQUEST })

      const { data } = await axios.get(`${process.env.SERVER_URL}/api/orders${query}`, axiosConfig)

      dispatch({
        type: cs.ORDERS_FILTER_SUCCESS,
        payload: data.orders,
      })
    } catch (err) {
      dispatch({
        type: cs.ORDERS_FILTER_FAILURE,
        payload: getErrMessage(err),
      })
    }
  }

export const updateDeliveryStatus = (id, body) => async (dispatch) => {
  try {
    dispatch({ type: cs.ORDER_UPDATE_REQUEST })

    const { data } = await axios.put(`${process.env.SERVER_URL}/api/orders/${id}`, body, config)
    dispatch({
      type: cs.ORDER_UPDATE_SUCCESS,
      payload: data.order,
    })

    dispatch({
      type: cs.ORDERS_LIST_UPDATE_SUCCESS,
      payload: data.order,
    })
  } catch (err) {
    dispatch({
      type: cs.ORDER_UPDATE_FAIL,
      payload: getErrMessage(err),
    })
  }
}
