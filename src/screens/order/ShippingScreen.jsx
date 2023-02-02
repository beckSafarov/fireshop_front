// libraries & methods
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
// ui components
import {
  CheckOutSteps,
  FormContainer,
  Spinner,
  FlashMsg,
} from '../../components'
import { Row, Col, Button } from 'react-bootstrap'
import { Formik, Form as FormikForm } from 'formik'
import * as Yup from 'yup'

// redux related
import { updateUserProfile as update } from '../../actions/userActions'
import { USER_INFO_UPDATE } from '../../constants'
import FormikFieldGroup from '../../components/FormikFieldGroup'
import { areSameObjects } from '../../helpers/utilities'
import { USER_DETAILS_PROPERTY_RESET as userInfoReset } from '../../constants'
import { withRouter } from 'react-router-dom'

const formFields = [
  { name: 'address', type: 'text', label: 'Address' },
  { name: 'city', type: 'text', label: 'City' },
  { name: 'postalCode', type: 'number', label: 'Postal Code' },
  { name: 'country', type: 'text', label: 'Country' },
]

const validationSchema = Yup.object().shape({
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

const ShippingScreen = ({ history }) => {
  // redux related
  const dispatch = useDispatch()
  const {
    loading,
    success: updateSuccess,
    error: updateError,
  } = useSelector((state) => state.userDetailsUpdate)
  const { userInfo } = useSelector((state) => state.userLogin)
  const shaddress = userInfo?.shippingAddress || {}
  const { cartItems } = useSelector((state) => state.cart)

  // variables
  const emptyCart =
    userInfo && userInfo.cartItems.length === 0 && cartItems.length === 0
  const hasAddress = userInfo?.shippingAddress ? true : false

  // hooks
  const [updatedFields, setUpdatedFields] = useState({})
  const [editMode, setEditMode] = useState(false)
  const [flashMsg, setFlashMsg] = useState({})

  useEffect(() => {
    if (userInfo && emptyCart) history.push('/')

    if (!hasAddress) setEditMode(true)

    if (updateSuccess) {
      dispatch({
        type: USER_INFO_UPDATE,
        payload: { shippingAddress: updatedFields },
      })
      setEditMode(false)
      setFlashMsg({ variant: 'success', msg: 'Updated successfully' })
      rxReset('success')
    }

    if (updateError) {
      setFlashMsg({ variant: 'danger', msg: updateError })
      rxReset('error')
    }

    return () => axios.CancelToken.source().cancel()
  }, [emptyCart, shaddress, updateSuccess, updateError])

  const rxReset = (payload) => {
    dispatch({ type: userInfoReset, payload })
  }

  const haveValsChanged = (vals) => {
    if (areSameObjects(shaddress, vals)) {
      setEditMode(false)
      return false
    }
    return true
  }

  const handleUpdate = (vals) => {
    setUpdatedFields(vals)
    dispatch(update({ shippingAddress: vals }))
  }

  const handleSubmit = (vals) => {
    if (haveValsChanged(vals)) handleUpdate(vals)
    return
  }

  const initialValues = {
    address: shaddress?.address || '',
    city: shaddress?.city || '',
    postalCode: shaddress?.postalCode || '',
    country: shaddress?.country || '',
  }

  const readModeBtns = [
    { variant: 'info', onClick: () => setEditMode(true), label: 'Edit' },
    {
      variant: 'success',
      onClick: () => history.push('/payment'),
      label: 'Confirm',
    },
  ]

  const editModeBtns = [
    {
      variant: 'secondary',
      type: 'reset',
      onClick: () => setEditMode(false),
      hidden: !hasAddress,
      label: 'Cancel',
    },
    {
      variant: 'success',
      type: 'submit',
      onClick: void 0,
      hidden: false,
      label: 'Save',
    },
  ]

  return (
    <FormContainer>
      <CheckOutSteps step={1} />
      <h1>Shipping Address</h1>
      <Spinner hidden={!loading} />
      <FlashMsg
        variant={flashMsg.variant}
        clearChildren={() => setFlashMsg({})}
      >
        {flashMsg.msg}
      </FlashMsg>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <FormikForm>
          {formFields.map((f, i) => (
            <FormikFieldGroup key={i} formField={f} readOnly={!editMode} />
          ))}
          <Row hidden={editMode}>
            {readModeBtns.map((btn, i) => (
              <Col key={i} mb={2}>
                <Button
                  type='button'
                  className='btn-block'
                  variant={btn.variant}
                  onClick={btn.onClick}
                >
                  {btn.label}
                </Button>
              </Col>
            ))}
          </Row>
          <Row hidden={!editMode}>
            {editModeBtns.map((btn, i) => (
              <Col key={i} mb={2} hidden={btn.hidden}>
                <Button
                  type={btn.type}
                  className='btn-block'
                  variant={btn.variant}
                  onClick={btn.onClick}
                >
                  {btn.label}
                </Button>
              </Col>
            ))}
          </Row>
        </FormikForm>
      </Formik>
    </FormContainer>
  )
}

export default withRouter(ShippingScreen)
