import * as cs from '../constants'
import produce from 'immer'

export const userListReducer = produce((draft = { users: [] }, action) => {
  switch (action.type) {
    case cs.USER_LIST_REQUEST:
      draft.loading = true
      break
    case cs.USER_LIST_SUCCESS:
      return { ...draft, loading: false, success: true, users: action.payload }
    case cs.USER_LIST_FAILURE:
      return { ...draft, loading: false, error: action.payload }
    case cs.USER_LIST_UPDATE:
      draft.users = draft.users.map((user) =>
        user._id === action.payload._id ? action.payload : user
      )
      draft.success = true
      break
    case cs.USER_LIST_REMOVE:
      draft.users = draft.users.filter((user) => user._id !== action.payload)
      draft.success = true
      break
    case cs.USER_LIST_PROPERTY_RESET:
      draft[action.payload] = null
      break
    default:
      return draft
  }
})

export const searchUserReducer = produce((draft = {}, action) => {
  switch (action.type) {
    case cs.ADMIN_SEARCH_USER_REQUEST:
      return { ...draft, loading: true }
    case cs.ADMIN_SEARCH_USER_SUCCESS:
      return { loading: false, success: true, users: action.payload }
    case cs.ADMIN_SEARCH_USER_FAILURE:
      return { loading: false, error: action.payload }
    case cs.ADMIN_SEARCH_PROPERTY_RESET:
      draft[action.payload] = null
      break
    case cs.ADMIN_SEARCH_USER_RESET:
      return {}
    default:
      return draft
  }
})

export const adminUserDeleteReducer = produce((draft = {}, action) => {
  switch (action.type) {
    case cs.ADMIN_USER_DELETE_REQUEST:
      return { ...draft, loading: true }
    case cs.ADMIN_USER_DELETE_SUCCESS:
      return { loading: false, success: true, message: action.payload }
    case cs.ADMIN_USER_DELETE_FAILURE:
      return { ...draft, loading: false, error: action.payload }
    case cs.ADMIN_USER_DELETE_RESET:
      return {}
    default:
      return draft
  }
})

export const adminUserUpdateReducer = produce((draft = {}, action) => {
  switch (action.type) {
    case cs.ADMIN_USER_UPDATE_REQUEST:
      return { ...draft, loading: true }
    case cs.ADMIN_USER_UPDATE_SUCCESS:
      return { loading: false, success: true, user: action.payload }
    case cs.ADMIN_USER_UPDATE_FAILURE:
      return { ...draft, loading: false, error: action.payload }
    case cs.ADMIN_USER_UPDATE_RESET:
      return {}
    default:
      return draft
  }
})

export const imgUploadReducer = produce((draft = {}, action) => {
  switch (action.type) {
    case cs.IMG_UPLOAD_REQUEST:
      return { ...draft, loading: true }
    case cs.IMG_UPLOAD_SUCCESS:
      return { loading: false, success: true, data: action.payload }
    case cs.IMG_UPLOAD_FAILURE:
      return { ...draft, error: action.payload }
    case cs.IMG_UPLOAD_RESET:
      return {}
    default:
      return draft
  }
})
