import produce from 'immer'
import * as cs from '../constants'
import { differenceBy } from 'lodash'

export const cartReducer = produce(
  (draft = { loading: false, message: null, cartItems: [] }, action) => {
    const successState = {
      loading: false,
      success: true,
      message: '',
    }
    switch (action.type) {
      // loading states
      case cs.CART_REQUIRE_ADD_ITEM:
      case cs.CART_REQUIRE_BUY_NOW:
      case cs.CART_REQUIRE_ALL_ITEMS:
      case cs.CARD_ITEM_QUANTITY_RESET_REQUIRE:
      case cs.CART_REMOVE_ITEM_REQUEST:
      case cs.CART_FLUSH_REQUIRE:
        return { ...draft, loading: true }
      // error states
      case cs.CART_ADD_ITEM_FAIL:
      case cs.CART_BUY_NOW_FAIL:
      case cs.CART_REQUIRE_ALL_ITEMS_FAIL:
      case cs.CARD_ITEM_QUANTITY_RESET_FAIL:
      case cs.CART_REMOVE_ITEM_FAILURE:
      case cs.CART_FLUSH_FAIL:
        return {
          ...draft,
          loading: false,
          error: action.payload,
        }
      // success states
      case cs.CART_ADD_ITEM:
        return {
          ...successState,
          successType: 'add',
          message: action.payload.message,
          cartItems: action.payload.cartItems,
        }
      case cs.CART_BUY_NOW_SUCCESS:
        return {
          ...successState,
          successType: 'add',
          cartItems: action.payload.cartItems,
        }
      case cs.CART_REQUIRE_ALL_ITEMS_SUCCESS:
        return {
          ...successState,
          successType: 'require',
          cartItems: action.payload,
        }
      case cs.CART_ITEMS_RECEIVED:
        return { ...draft, cartItems: action.payload }
      case cs.CARD_ITEM_QUANTITY_RESET_SUCCESS:
        const { _id, qty } = action.payload
        const cartItemsAfterQtyReset = draft.cartItems.map((item) =>
          item._id === _id ? { ...item, qty } : item
        )
        return {
          ...successState,
          cartItems: cartItemsAfterQtyReset,
          successType: 'reset',
        }
      case cs.CART_REMOVE_ITEM_SUCCESS:
        const cartItemsAfterRemove = draft.cartItems.filter(
          (item) => item._id !== action.payload
        )
        return {
          ...successState,
          cartItems: cartItemsAfterRemove,
          successType: 'remove',
        }
      case cs.CART_REMOVE_ITEMS:
        draft.cartItems = differenceBy(
          draft.cartItems,
          action.payload.cartItems,
          '_id'
        )
        break
      case cs.CART_SAVE_PAYMENT_METHOD:
        return { ...draft, paymentMethod: action.payload }
      case cs.CART_PROPERTY_RESET:
        draft[action.payload] = null
        break
      case cs.CART_FLUSH:
        return {
          ...successState,
          cartItems: [],
          successType: '',
          message: '',
        }
      default:
        return draft
    }
  }
)
