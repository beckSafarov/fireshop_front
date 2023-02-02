import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// UI components
import { Modal, Form, Button } from 'react-bootstrap'
import { FlashMsg, Spinner } from '..'
import { updateDeliveryStatus } from '../../actions/orderActions'
import axios from 'axios'
import { ORDER_UPDATE_RESET as updateReset } from '../../constants'

const stepOptions = ['Received', 'Packed', 'Shipped', 'Delivered']

const UpdateDeliveryModal = ({ modal, onClose }) => {
  const dispatch = useDispatch()
  const [_id, setId] = useState(modal._id)
  const [deliveryStatus, setDeliveryStatus] = useState(modal.deliveryStatus)
  const [change, setChange] = useState(false)
  const [flashMsg, setFlashMsg] = useState({})

  const { loading, type, error } = useSelector((state) => state.orderDetails)
  const updateLoading = loading && type === 'update'

  useEffect(() => {
    if (error && type === 'update') {
      setFlashMsg({ msg: error })
      setChange(false)
      dispatch({ type: updateReset, payload: 'error' })
    }

    if (!_id || modal._id === _id) {
      setId(modal._id)
      setDeliveryStatus(modal.status)
    }

    return () => axios.CancelToken.source().cancel()
  }, [error, modal])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(updateDeliveryStatus(_id, { deliveryStatus }))
  }

  const handleChange = (e) => {
    setChange(true)
    setDeliveryStatus(stepOptions[e.target.value])
  }

  return (
    <Modal
      show={modal.display}
      onHide={onClose}
      dialogClassName='modal-90w'
      aria-labelledby='example-custom-modal-styling-title'
    >
      <Modal.Header closeButton>
        <Modal.Title id='example-custom-modal-styling-title'>{_id}</Modal.Title>
      </Modal.Header>
      <Spinner hidden={!updateLoading} />
      <FlashMsg variant='danger' clearChildren={() => setFlashMsg({})}>
        {flashMsg.msg}
      </FlashMsg>
      <Modal.Body variant='flush'>
        <Form>
          <Form.Control
            as='select'
            value={stepOptions.indexOf(deliveryStatus)}
            onChange={handleChange}
          >
            {stepOptions.map((step, i) => (
              <option key={i} value={i}>
                {step}
              </option>
            ))}
          </Form.Control>
          <div className='mt-4'>
            <Button
              className='btn-block'
              type='button'
              variant='success'
              disabled={!change}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default UpdateDeliveryModal
