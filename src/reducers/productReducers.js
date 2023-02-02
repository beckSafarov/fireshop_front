import * as cs from '../constants.js'
import produce from 'immer'

export const productListReducer = produce(
  (draft = { products: [] }, action) => {
    const errState = { ...draft, loading: false, error: action.payload }
    const changeStateToSuccess = (type) => {
      draft.loading = false
      draft.type = type
      draft.success = true
    }
    switch (action.type) {
      case cs.PRODUCT_LIST_REQUEST:
      case cs.PRODUCT_ADD_REQUEST:
      case cs.PRODUCT_DELETE_REQUEST:
        return { ...draft, loading: true }
      case cs.PRODUCT_LIST_SUCCESS:
        return {
          type: 'request',
          loading: false,
          success: true,
          ...action.payload,
        }
      case cs.PRODUCT_LIST_FAILURE:
        return { ...errState, type: 'request' }
      case cs.PRODUCT_ADD_SUCCESS:
        draft.products.push({ ...action.payload, new: true })
        changeStateToSuccess('add')
        break
      case cs.PRODUCT_ADD_FAILURE:
        return { ...errState, type: 'add' }
      case cs.PRODUCT_LIST_UPDATE:
        const updatedProduct = action.payload
        draft.products = draft.products.map((p) => {
          if (p._id === updatedProduct._id) {
            if (updatedProduct.new) updatedProduct.new = false
            return { ...p, ...updatedProduct }
          }
          return p
        })
        changeStateToSuccess('update')
        break
      case cs.PRODUCT_DELETE_SUCCESS:
        draft.products = draft.products.filter((p) => p._id !== action.payload)
        changeStateToSuccess('delete')
        return
      case cs.PRODUCT_DELETE_FAILURE:
        return { ...errState, type: 'delete' }
      case cs.PRODUCT_LIST_PROPERTY_RESET:
        draft[action.payload] = null
        break
      default:
        return draft
    }
  }
)

export const productSearchReducer = produce((draft = {}, action) => {
  switch (action.type) {
    case cs.PRODUCT_SEARCH_REQUEST:
      return { ...draft, loading: true }
    case cs.PRODUCT_SEARCH_SUCCESS:
      return {
        loading: false,
        success: true,
        ...action.payload,
      }
    case cs.PRODUCT_SEARCH_FAILURE:
      return { loading: false, products: [], error: action.payload }
    case cs.PRODUCT_SEARCH_RESET:
      return {}
    case cs.PRODUCT_SEARCH_PROPERTY_RESET:
      draft[action.payload] = null
      break
    default:
      return draft
  }
})



export const productDetailsReducer = produce(
  (draft = { reviews: [] }, action) => {
    const successState = {
      loading: false,
      product: action.payload,
      success: true,
    }
    const errState = { ...draft, loading: false, error: action.payload }
    switch (action.type) {
      case cs.PRODUCT_DETAILS_REQUEST:
      case cs.PRODUCT_DETAILS_UPDATE_REQUEST:
        return { ...draft, loading: true }
      case cs.PRODUCT_DETAILS_SUCCESS:
        return { ...successState, type: 'request' }
      case cs.PRODUCT_DETAILS_FAILURE:
        return { ...errState, type: 'request' }
      case cs.PRODUCT_DETAILS_UPDATE_SUCCESS:
        return { ...successState, type: 'update' }
      case cs.PRODUCT_DETAILS_UPDATE_FAILURE:
        return { ...errState, type: 'update' }
      case cs.PRODUCT_REVIEW_UPDATE:
        const { user, body: updatedReview } = action.payload
        draft.product.reviews = draft.product.reviews.map((review) =>
          review.user === user ? { ...review, updatedReview } : review
        )
        draft.loading = false
        draft.success = true
        draft.type = 'update'
        break
      case cs.PRODUCT_DETAILS_RESET:
        draft[action.payload] = null
        break
      default:
        return draft
    }
  }
)

export const productReviewReducer = produce(
  (draft = { reviews: [] }, action) => {
    switch (action.type) {
      case cs.PRODUCT_REVIEW_REQUEST:
      case cs.PRODUCT_REVIEW_UPDATE_REQUEST:
        return { loading: true }
      case cs.PRODUCT_REVIEW_SUCCESS:
      case cs.PRODUCT_REVIEW_UPDATE_SUCCESS:
        return { loading: false, success: true }
      case cs.PRODUCT_REVIEW_FAILURE:
      case cs.PRODUCT_REVIEW_UPDATE_FAILURE:
        return { loading: false, error: action.payload }
      case cs.PRODUCT_REVIEW_PROPERTY_RESET:
        draft[action.payload] = null
        break
      default:
        return draft
    }
  }
)
export const productTopReducer = produce((draft = {}, action) => {
  switch (action.type) {
    case cs.PRODUCT_TOP_REQUEST:
      return { loading: true }
    case cs.PRODUCT_TOP_SUCCESS:
      return { loading: false, products: action.payload }
    case cs.PRODUCT_TOP_FAILURE:
      return { loading: false, error: action.payload }
    default:
      return draft
  }
})
