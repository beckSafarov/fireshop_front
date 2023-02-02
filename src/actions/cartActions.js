import * as constants from '../constants.js'
import axios from 'axios'
import * as lcs from '../helpers/cartLCS.js'
import { getErrMessage } from '../helpers/utilities.js'
import { fullConfig, cancelTokenConfig } from '../helpers/rxConfigs.js'

export const addToCart =
  (product, logged = true, many = false) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: constants.CART_REQUIRE_ADD_ITEM })
      if (logged) {
        const manyRoute = many ? '/many' : ''
        const res = await axios.post(
          `${process.env.SERVER_URL}/api/users/cartItems${manyRoute}`,
          product,
          fullConfig
        )

        dispatch({
          type: constants.CART_ADD_ITEM,
          payload: {
            cartItems: res.data.cartItems,
            message: res.data.message,
          },
        })

        if (many) lcs.flushCart()

        const newCartItems = getState().cart.cartItems
        dispatch({
          type: constants.USER_INFO_UPDATE,
          payload: {
            cartItems: newCartItems,
          },
        })
      } else {
        const { cart: newCart, message } = lcs.add(product)
        dispatch({
          type: constants.CART_ADD_ITEM,
          payload: {
            cartItems: newCart,
            message: message,
          },
        })
      }
    } catch (err) {
      dispatch({
        type: constants.CART_ADD_ITEM_FAIL,
        payload: getErrMessage(err),
      })
    }
  }

export const buyNowAction =
  (product, qty, logged) => async (dispatch, getState) => {
    try {
      dispatch({ type: constants.CART_REQUIRE_BUY_NOW })

      if (logged) {
        const res = await axios.post(
          `${process.env.SERVER_URL}/api/users/cartItems`,
          { ...product, qty },
          fullConfig
        )

        dispatch({
          type: constants.CART_BUY_NOW_SUCCESS,
          payload: {
            cartItems: res.data.cartItems,
            message: res.data.message,
          },
        })
        const newCartItems = getState().cart.cartItems
        dispatch({
          type: constants.USER_INFO_UPDATE,
          payload: {
            cartItems: newCartItems,
          },
        })
      } else {
        const { cart: newCart, message } = lcs.add(product)
        dispatch({
          type: constants.CART_BUY_NOW_SUCCESS,
          payload: {
            cartItems: newCart,
            message: message,
          },
        })
      }
    } catch (err) {
      dispatch({
        type: constants.CART_BUY_NOW_FAIL,
        payload: getErrMessage(err),
      })
    }
  }

export const qtyReset =
  (product, logged = true) =>
  async (dispatch) => {
    try {
      dispatch({ type: constants.CARD_ITEM_QUANTITY_RESET_REQUIRE })

      logged
        ? await axios.put(process.env.SERVER_URL+'/api/users/cartItems/qty', product, fullConfig)
        : lcs.qtyUpdate(product)

      dispatch({
        type: constants.CARD_ITEM_QUANTITY_RESET_SUCCESS,
        payload: product,
      })
    } catch (err) {
      dispatch({
        type: constants.CARD_ITEM_QUANTITY_RESET_FAIL,
        payload: getErrMessage(err),
      })
    }
  }

export const removeItem =
  (id, logged = true) =>
  async (dispatch) => {
    try {
      dispatch({ type: constants.CART_REMOVE_ITEM_REQUEST })

      logged
        ? await axios.delete(`${process.env.SERVER_URL}/api/users/cartItems/${id}`, cancelTokenConfig)
        : lcs.remove({ _id: id })

      dispatch({
        type: constants.CART_REMOVE_ITEM_SUCCESS,
        payload: id,
      })
    } catch (err) {
      dispatch({
        type: constants.CART_REMOVE_ITEM_FAILURE,
        payload: getErrMessage(err),
      })
    }
  }

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: constants.CART_SAVE_PAYMENT_METHOD,
    payload: data,
  })

  localStorage.setItem('paymentMethod', JSON.stringify(data))
}

export const flushCart = () => async (dispatch) => {
  dispatch({
    type: constants.CART_FLUSH,
  })
}
