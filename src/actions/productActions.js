import * as cs from '../constants.js'
import axios from 'axios'
import { axiosConfig, config } from '../helpers/axiosConfigs'
import { getErrMessage } from '../helpers/utilities.js'

export const listProducts =
  (keyword = '', pageNumber = '') =>
  async (dispatch) => {
    const getDispatchType = (status) =>
      keyword
        ? cs[`PRODUCT_SEARCH_${status.toUpperCase()}`]
        : cs[`PRODUCT_LIST_${status.toUpperCase()}`]
    try {
      dispatch({ type: getDispatchType('request') })

      const { data } = await axios.get(
        `${process.env.SERVER_URL}/api/products?keyword=${keyword}&pageNumber=${pageNumber}`,
        axiosConfig
      )

      dispatch({ type: getDispatchType('success'), payload: { ...data } })
    } catch (err) {
      dispatch({
        type: getDispatchType('failure'),
        payload: getErrMessage(err),
      })
    }
  }

export const listTopProducts = () => async (dispatch) => {
  try {
    dispatch({ type: cs.PRODUCT_TOP_REQUEST })

    const { data } = await axios.get(`${process.env.SERVER_URL}/api/products/top`, axiosConfig)

    dispatch({ type: cs.PRODUCT_TOP_SUCCESS, payload: data.products })
  } catch (err) {
    dispatch({
      type: cs.PRODUCT_TOP_FAILURE,
      payload: getErrMessage(err),
    })
  }
}

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: cs.PRODUCT_DETAILS_REQUEST })

    const { data } = await axios.get(`${process.env.SERVER_URL}/api/products/${id}`, axiosConfig)

    dispatch({ type: cs.PRODUCT_DETAILS_SUCCESS, payload: data.data })
  } catch (err) {
    dispatch({
      type: cs.PRODUCT_DETAILS_FAILURE,
      payload: getErrMessage(err),
    })
  }
}

export const productReviewAction = (id, body) => async (dispatch) => {
  try {
    dispatch({ type: cs.PRODUCT_REVIEW_REQUEST })

    await axios.post(`${process.env.SERVER_URL}/api/products/${id}/reviews`, body, config)

    dispatch({ type: cs.PRODUCT_REVIEW_SUCCESS })
  } catch (err) {
    dispatch({
      type: cs.PRODUCT_REVIEW_FAILURE,
      payload: getErrMessage(err),
    })
  }
}

export const productReviewUpdateAction =
  (id, body, user) => async (dispatch) => {
    try {
      dispatch({ type: cs.PRODUCT_REVIEW_UPDATE_REQUEST })

      await axios.put(`${process.env.SERVER_URL}/api/products/${id}/reviews`, body, config)

      dispatch({ type: cs.PRODUCT_REVIEW_UPDATE_SUCCESS })
      dispatch({
        type: cs.PRODUCT_REVIEW_UPDATE,
        payload: { user, body },
      })
    } catch (err) {
      dispatch({
        type: cs.PRODUCT_REVIEW_UPDATE_FAILURE,
        payload: getErrMessage(err),
      })
    }
  }
