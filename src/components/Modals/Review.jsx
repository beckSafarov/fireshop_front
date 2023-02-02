import { useState, useEffect } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { Spinner } from '..'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {
  productReviewAction as newRev,
  listProductDetails as getProduct,
  productReviewUpdateAction as updateRev,
} from '../../actions/productActions'
import { PRODUCT_REVIEW_PROPERTY_RESET as revReset } from '../../constants'
import Rate from '../Product/Rate'
import { onlyProps } from '../../helpers/utilities'
import FlashMsg from '../globals/FlashMsg'

const Review = ({ modal, onClose }) => {
  const dispatch = useDispatch()

  // redux stores
  const {
    loading: revLoading,
    success,
    error,
  } = useSelector((state) => state.productReviewStore)
  const { loading: detailsLoading, product } = useSelector(
    (state) => state.productDetails
  )

  // hooks
  const [flashMsg, setFlashMsg] = useState({})
  const [clearExisting, setClearExisting] = useState(false)
  const [fields, setFields] = useState({ comment: '', rating: '' })

  // variables
  const dataExists = product && product.reviews && product._id === modal._id
  const reviewed =
    dataExists && product.reviews.find((r) => r.user === modal.user)
  const loading = revLoading || detailsLoading

  useEffect(() => {
    !dataExists && dispatch(getProduct(modal._id))

    if (reviewed) {
      setFields(onlyProps(reviewed, ['rating', 'comment']))
    }

    if (success) {
      setFlashMsg({
        variant: 'success',
        msg: reviewed ? 'Updated successfully!' : 'Thank you for your review!',
      })
      dispatch({ type: revReset, payload: 'success' })
      setClearExisting(true)
      setTimeout(() => onClose(), 1500)
    }

    if (error) {
      setFlashMsg({ variant: 'danger', msg: error })
      dispatch({ type: revReset, payload: 'error' })
    }

    return () => {
      axios.CancelToken.source().cancel()
      clearExisting && dispatch(getProduct(modal._id))
    }
  }, [reviewed, success, error, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    reviewed
      ? dispatch(updateRev(modal._id, fields, modal.user))
      : dispatch(newRev(modal._id, fields))
  }

  return (
    <Modal
      show={modal.display}
      onHide={onClose}
      dialogClassName='modal-90w'
      aria-labelledby='example-custom-modal-styling-title'
    >
      <Modal.Header closeButton>
        <Modal.Title>Review</Modal.Title>
      </Modal.Header>
      <Modal.Body variant='flush'>
        <Spinner hidden={!loading} />
        <FlashMsg
          variant={flashMsg.variant}
          clearChildren={() => setFlashMsg({})}
        >
          {flashMsg.msg}
        </FlashMsg>
        <Form>
          <Form.Group className='mb-3' controlId='rating'>
            <Form.Label>Rate</Form.Label>
            <Rate
              stars={fields.rating}
              setStars={(r) => setFields((f) => ({ ...f, rating: r }))}
            />
          </Form.Group>
          <Form.Group controlId='comment'>
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as='textarea'
              value={fields.comment}
              name='comment'
              placeholder='Leave a comment here'
              style={{ height: '100px', resize: 'none' }}
              onChange={(e) =>
                setFields((f) => ({ ...f, comment: e.target.value }))
              }
            />
          </Form.Group>
          <Button
            className='btn-block'
            type='submit'
            variant='success'
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

Review.defaultProps = {
  modal: {
    display: true,
    _id: '',
    user: '',
  },
  onClose: () => void 0,
}

export default Review
