// libraries & methods
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form as FormikForm } from 'formik'
import * as Yup from 'yup'

// UI components
import Modal from 'react-bootstrap/Modal'
import { Message, Spinner } from '..'

// redux actions
import { ADMIN_USER_UPDATE_RESET as updateReset } from '../../constants'
import { Button } from 'react-bootstrap'
import { MAX_NAME_CHARS } from '../../config'
import FormikFieldGroup from '../FormikFieldGroup'
import { areSameObjects, withoutProps } from '../../helpers/utilities'
import { adminUpdateUser } from '../../actions/adminActions'
import FlashMsg from '../globals/FlashMsg'

const defaultFields = {
  name: '',
  email: '',
  admin: false,
  shippingAddress: {
    address: '',
    city: '',
    postalCode: '',
    country: '',
  },
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(MAX_NAME_CHARS, 'Too Long!')
    .required('Please enter your name!'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Please enter your email'),
  address: Yup.string()
    .min(4, 'Too Short!')
    .max(32, 'Too Long!')
    .required('Please enter your address!'),
  city: Yup.string()
    .min(2, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Please enter your city name!'),
  postalCode: Yup.number()
    .min(0, 'Invalid PostCode!')
    .required('Please enter your postal code!'),
  country: Yup.string()
    .min(3, 'Too Short!')
    .max(32, 'Too Long!')
    .required('Please enter your country name!'),
})

const UserEditModal = ({ modal, onClose }) => {
  const dispatch = useDispatch()
  const {
    loading,
    success: updated,
    error,
  } = useSelector((state) => state.adminUserUpdate)

  // hooks
  const [userInfo, setUserInfo] = useState(defaultFields)
  const [flashMsg, setFlashMsg] = useState({})

  useEffect(() => {
    if (modal.userInfo && !userInfo.name) {
      setUserInfo({ ...modal.userInfo, ...modal.userInfo.shippingAddress })
    }
    if (updated) handleClose()

    if (error) {
      setFlashMsg({ msg: error })
      dispatch({ type: updateReset, payload: 'error' })
    }
  }, [modal.userInfo, updated, error])

  const haveValsChanged = (vals) => {
    if (areSameObjects(vals, userInfo)) {
      handleClose()
      return false
    }
    return true
  }

  const handleUpdate = (vals) => {
    const user = withoutProps(vals, [
      'address',
      'country',
      'postalCode',
      'city',
    ])
    user.shippingAddress = {
      address: vals.address,
      country: vals.country,
      postalCode: vals.postalCode,
      city: vals.city,
    }
    dispatch(adminUpdateUser(user._id, user))
  }

  const handleSubmit = (vals) => {
    if (haveValsChanged(vals)) handleUpdate(vals)
    return false
  }

  const formFields = [
    { name: 'name', type: 'text', label: 'Full Name' },
    { name: 'email', type: 'email', label: 'Email' },
    { name: 'isAdmin', type: 'switch' },
    { name: 'address', type: 'text', label: 'Address' },
    { name: 'city', type: 'text', label: 'City' },
    { name: 'postalCode', type: 'number', label: 'Postal Code' },
    { name: 'country', type: 'text', label: 'Country' },
  ]

  const handleClose = () => {
    setUserInfo(defaultFields)
    onClose()
  }

  return (
    <Modal
      show={modal.display}
      onHide={handleClose}
      dialogClassName='modal-90w'
      aria-labelledby='example-custom-modal-styling-title'
    >
      <Modal.Header closeButton>
        <Modal.Title id='example-custom-modal-styling-title'>
          Updating: {userInfo.name}
        </Modal.Title>
      </Modal.Header>
      <Spinner hidden={!loading} />
      <FlashMsg variant='danger' clearChildren={() => setFlashMsg({})}>
        {flashMsg.msg}
      </FlashMsg>
      <Modal.Body variant='flush'>
        {userInfo.name && (
          <Formik
            initialValues={userInfo}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <FormikForm>
              {formFields.map((f, i) => (
                <FormikFieldGroup key={i} formField={f} />
              ))}
              <Button type='submit' className='btn-block' variant='success'>
                Save
              </Button>
            </FormikForm>
          </Formik>
        )}
      </Modal.Body>
    </Modal>
  )
}

UserEditModal.defaultProps = {
  active: false,
  modal: {
    display: false,
    userInfo: defaultFields,
  },
}

export default UserEditModal
