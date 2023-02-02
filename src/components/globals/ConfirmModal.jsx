import { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'

const ConfirmModal = ({
  active,
  heading,
  message,
  confirmHandler,
  hideHandler,
  proceedText,
  primaryVariant,
}) => {
  const [show, setShow] = useState(null)

  useEffect(() => {
    setShow(active)
  }, [active])

  return (
    <Modal show={active} onHide={hideHandler}>
      <Modal.Header closeButton>
        <Modal.Title>{heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={hideHandler}>
          Cancel
        </Button>
        <Button variant={primaryVariant} onClick={confirmHandler}>
          {proceedText}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ConfirmModal.defaultProps = {
  active: false,
  heading: 'Confirmation Required',
  message: 'Are you sure to proceed?',
  confirmHandler: (status) => console.log(status),
  hideHandler: () => console.log('hideHandler not passed'),
  proceedText: 'PROCEED',
  primaryVariant: 'success',
}

export default ConfirmModal
