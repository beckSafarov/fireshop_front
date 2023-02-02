import * as cs from '../constants'
import produce from 'immer'
const successState = { loading: false, success: true }

export const userLoginReducer = produce((draft = {}, action) => {
  switch (action.type) {
    case cs.USER_LOGIN_REQUEST:
      return { loading: true }
    case cs.USER_LOGIN_SUCCESS:
      return { ...successState, userInfo: action.payload }
    case cs.USER_LOGIN_FAILURE:
    case cs.USER_LOGOUT_FAILURE:
      return { loading: false, error: action.payload }
    case cs.USER_LOGOUT_REQUEST:
      return { loading: false }
    case cs.USER_LOGOUT_SUCCESS:
      return successState
    case cs.USER_INFO_UPDATE:
      return {
        ...successState,
        userInfo: { ...draft.userInfo, ...action.payload },
      }
    case cs.USER_DETAILS_CLEAR:
      return {}
    default:
      return draft
  }
})

export const userRegisterReducer = produce((draft = {}, action) => {
  switch (action.type) {
    case cs.USER_REGISTER_REQUEST:
      return { loading: true }
    case cs.USER_REGISTER_SUCCESS:
      return successState
    case cs.USER_REGISTER_FAILURE:
      return { loading: false, error: action.payload }
    default:
      return draft
  }
})

export const updateUserDetailsReducer = produce((draft = {}, action) => {
  switch (action.type) {
    case cs.USER_DETAILS_UPDATE_REQUEST:
      return { loading: true }
    case cs.USER_DETAILS_UPDATE_SUCCESS:
      return successState
    case cs.USER_DETAILS_UPDATE_FAILURE:
      return { loading: false, error: action.payload }
    case cs.USER_DETAILS_PROPERTY_RESET:
      draft[action.payload] = null
      break
    default:
      return draft
  }
})

export const ShaddressReducer = produce((draft = {}, action) => {
  switch (action.type) {
    case cs.SHADDRESS_POST_REQUEST:
      return { loading: true }
    case cs.SHADDRESS_POST_SUCCESS:
      return { loading: false, success: true, data: action.payload }
    case cs.SHADDRESS_POST_FAILURE:
      return { loading: false, error: action.payload }
    case cs.SHADDRESS_PROPERTY_RESET:
      draft[action.payload] = null
      break
    default:
      return draft
  }
})
