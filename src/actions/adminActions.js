import * as cs from '../constants.js'
import axios from 'axios'
import { getErrMessage } from '../helpers/utilities.js'
import { fullConfig as config } from '../helpers/rxConfigs.js'

export const listUsers = () => async (dispatch) => {
  try {
    dispatch({ type: cs.USER_LIST_REQUEST })

    const { data } = await axios.get(process.env.SERVER_URL+'/api/admin/users')

    dispatch({ type: cs.USER_LIST_SUCCESS, payload: data })
  } catch (err) {
    dispatch({
      type: cs.USER_LIST_FAILURE,
      payload: getErrMessage(err),
    })
  }
}

export const searchUser =
  (field = '', secondaryField = '', keyword = '') =>
  async (dispatch) => {
    try {
      dispatch({ type: cs.ADMIN_SEARCH_USER_REQUEST })

      const { data } = await axios.get(
        `${process.env.SERVER_URL}/api/admin/users?field=${field}&secondaryField=${secondaryField}&keyword=${keyword}`
      )

      dispatch({ type: cs.ADMIN_SEARCH_USER_SUCCESS, payload: data })
    } catch (err) {
      dispatch({
        type: cs.ADMIN_SEARCH_USER_FAILURE,
        payload: getErrMessage(err),
      })
    }
  }

export const adminUpdateUser = (id, body) => async (dispatch) => {
  try {
    dispatch({ type: cs.ADMIN_USER_UPDATE_REQUEST })
    const { data } = await axios.put(`${process.env.SERVER_URL}/api/admin/userss/${id}`, body, config)
    dispatch({ type: cs.ADMIN_USER_UPDATE_SUCCESS, payload: data.user })
    dispatch({ type: cs.USER_LIST_UPDATE, payload: data.user })
  } catch (err) {
    dispatch({
      type: cs.ADMIN_USER_UPDATE_FAILURE,
      payload: getErrMessage(err),
    })
  }
}

export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: cs.ADMIN_USER_DELETE_REQUEST })
    const { data } = await axios.delete(`${process.env.SERVER_URL}/api/admin/users/${id}`)
    dispatch({
      type: cs.USER_LIST_REMOVE,
      payload: id,
    })
    dispatch({
      type: cs.ADMIN_USER_DELETE_SUCCESS,
      payload: data.message,
    })
  } catch (err) {
    dispatch({
      type: cs.ADMIN_USER_DELETE_FAILURE,
      payload: getErrMessage(err),
    })
  }
}

export const addProduct = () => async (dispatch) => {
  try {
    dispatch({ type: cs.PRODUCT_ADD_REQUEST })
    const { data } = await axios.post(`${process.env.SERVER_URL}/api/products`)
    dispatch({ type: cs.PRODUCT_ADD_SUCCESS, payload: data })
  } catch (err) {
    dispatch({
      type: cs.PRODUCT_ADD_FAILURE,
      payload: getErrMessage(err),
    })
  }
}

export const updateProduct = (body) => async (dispatch) => {
  try {
    dispatch({ type: cs.PRODUCT_DETAILS_UPDATE_REQUEST })
    await axios.put(`${process.env.SERVER_URL}/api/products/${body._id}`, body, config)

    dispatch({
      type: cs.PRODUCT_DETAILS_UPDATE_SUCCESS,
      payload: body,
    })

    dispatch({
      type: cs.PRODUCT_LIST_UPDATE,
      payload: body,
    })
  } catch (err) {
    dispatch({
      type: cs.PRODUCT_DETAILS_UPDATE_FAILURE,
      payload: getErrMessage(err),
    })
  }
}

export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: cs.PRODUCT_DELETE_REQUEST })
    await axios.delete(`${process.env.SERVER_URL}/api/products/${id}`)
    dispatch({
      type: cs.PRODUCT_DELETE_SUCCESS,
      payload: id,
    })
  } catch (err) {
    dispatch({
      type: cs.PRODUCT_DELETE_FAILURE,
      payload: getErrMessage(err),
    })
  }
}

export const imgUpload = (formData) => async (dispatch) => {
  try {
    dispatch({ type: cs.IMG_UPLOAD_REQUEST })

    const { data } = await axios.post(`${process.env.SERVER_URL}/api/upload/`, formData, {
      headers: { 'Content-type': 'multipart/form-data' },
    })

    dispatch({
      type: cs.IMG_UPLOAD_SUCCESS,
      payload: data,
    })
  } catch (err) {
    dispatch({
      type: cs.IMG_UPLOAD_FAILURE,
      payload: getErrMessage(err),
    })
  }
}
