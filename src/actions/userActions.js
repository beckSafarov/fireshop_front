import * as cs from '../constants.js'
import axios from 'axios'
import { fullConfig as config } from '../helpers/rxConfigs.js'
import { getErrMessage } from '../helpers/utilities.js'

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: cs.USER_LOGIN_REQUEST })

    const { data } = await axios.post(
      process.env.SERVER_URL+'/api/users/login',
      { email, password },
      config
    )

    dispatch({ type: cs.USER_LOGIN_SUCCESS, payload: data.data })
    dispatch({
      type: cs.CART_ITEMS_RECEIVED,
      payload: data.data.cartItems,
    })
  } catch (err) {
    dispatch({
      type: cs.USER_LOGIN_FAILURE,
      payload: getErrMessage(err),
    })
  }
}

export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: cs.USER_LOGOUT_REQUEST })
    await axios.put(process.env.SERVER_URL+'/api/users/logout')
    dispatch({ type: cs.USER_LOGOUT_SUCCESS })
    dispatch({ type: cs.USER_DETAILS_CLEAR })
    dispatch({ type: cs.CART_FLUSH })
    dispatch({ type: cs.MY_ORDERS_RESET })
  } catch (err) {
    dispatch({
      type: cs.USER_LOGOUT_FAILURE,
      payload: getErrMessage(err),
    })
  }
}

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: cs.USER_REGISTER_REQUEST })

    const { data } = await axios.post(
      process.env.SERVER_URL+'/api/users',
      { name, email, password },
      config
    )

    dispatch({ type: cs.USER_REGISTER_SUCCESS })
    dispatch({ type: cs.USER_LOGIN_SUCCESS, payload: data.data })
  } catch (err) {
    dispatch({
      type: cs.USER_REGISTER_FAILURE,
      payload: getErrMessage(err),
    })
  }
}

export const updateUserProfile = (user) => async (dispatch) => {
  try {
    dispatch({ type: cs.USER_DETAILS_UPDATE_REQUEST })
    await axios.put(process.env.SERVER_URL+'/api/users/profile', user, config)
    dispatch({ type: cs.USER_DETAILS_UPDATE_SUCCESS })
  } catch (err) {
    dispatch({
      type: cs.USER_DETAILS_UPDATE_FAILURE,
      payload: getErrMessage(err),
    })
  }
}

export const getMe = () => async (dispatch) => {
  try {
    dispatch({ type: cs.USER_LOGIN_REQUEST })

    const { data } = await axios.get(process.env.SERVER_URL+'/api/users/me', {
      cancelToken: axios.CancelToken.source().token,
    })

    dispatch({
      type: cs.USER_LOGIN_SUCCESS,
      payload: data.user || false,
    })
    dispatch({
      type: cs.CART_ITEMS_RECEIVED,
      payload: data.user?.cartItems || [],
    })
  } catch (err) {
    dispatch({
      type: cs.USER_LOGIN_FAILURE,
      payload: getErrMessage(err),
    })
  }
}

export const createShaddress = (shaddress) => async (dispatch) => {
  try {
    dispatch({ type: cs.SHADDRESS_POST_REQUEST })

    const { data } = await axios.post(
      process.env.SERVER_URL+'/api/users/shippingaddress',
      shaddress,
      config
    )

    dispatch({
      type: cs.SHADDRESS_POST_SUCCESS,
      payload: data.shippingAddress,
    })
  } catch (err) {
    dispatch({
      type: cs.SHADDRESS_POST_FAILURE,
      payload: getErrMessage(err),
    })
  }
}
