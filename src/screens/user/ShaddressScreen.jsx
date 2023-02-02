// -- LIBRARIES/METHODS --
import { useState, useEffect } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Formik, Form as FormikForm } from 'formik'
import * as Yup from 'yup'

// -- COMPONENTS --
import { AccountSideMenu, Spinner, FlashMsg } from '../../components'

// -- REDUX RELATED IMPORTS --
import { updateUserProfile as update } from '../../actions/userActions'
import { USER_DETAILS_PROPERTY_RESET as userInfoReset } from '../../constants'
import { USER_INFO_UPDATE } from '../../constants'
import { areSameObjects } from '../../helpers/utilities'
import FormikFieldGroup from '../../components/FormikFieldGroup'
import Meta from '../../components/Meta'

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

const ShaddressScreen = ({ history }) => {
  const dispatch = useDispatch()

  // redux stores
  const { userInfo } = useSelector((state) => state.userLogin)
  const shaddress =
    userInfo && userInfo.shippingAddress ? userInfo.shippingAddress : null
  const {
    loading,
    success: updateSuccess,
    error: updateError,
  } = useSelector((state) => state.userDetailsUpdate)

  //hooks
  const [updatedFields, setUpdatedFields] = useState({})
  const [editMode, setEditMode] = useState(false)
  const [flashMsg, setFlashMsg] = useState({})

  useEffect(() => {
    if (updateSuccess) {
      dispatch({
        type: USER_INFO_UPDATE,
        payload: { shippingAddress: updatedFields },
      })
      setEditMode(false)
      setFlashMsg({ variant: 'success', msg: 'Updated Successfully' })
      rxReset('success')
    }

    if (updateError) {
      setFlashMsg({ variant: 'danger', msg: updateError })
      rxReset('error')
    }

    return () => axios.CancelToken.source().cancel()
  }, [updateSuccess, updateError])

  const rxReset = (payload) => dispatch({ type: userInfoReset, payload })

  const handleSubmit = (vals) => {
    if (areSameObjects(shaddress, vals)) {
      setEditMode(false)
      return
    }
    setUpdatedFields(vals)
    dispatch(update({ shippingAddress: vals }))
  }

  const initialValues = {
    address: shaddress?.address || '',
    city: shaddress?.city || '',
    postalCode: shaddress?.postalCode || '',
    country: shaddress?.country || '',
  }

  const editModeBtns = [
    {
      type: 'reset',
      variant: 'secondary',
      onClick: () => setEditMode(false),
      label: 'Cancel',
    },
    { type: 'submit', variant: 'success', onClick: void 0, label: 'Save' },
  ]

  return (
    <Row>
      <>
        <Meta title={userInfo && `${userInfo.name} | Address`} />
        <Spinner hidden={!loading} />
        <Col md={2} sm={2}>
          <AccountSideMenu active={2} />
        </Col>
        <Col md={10} sm={10}>
          <h3 className='mb-4'>Address</h3>
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
              <Button
                hidden={editMode}
                type='button'
                className='btn-block'
                variant='info'
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
              <Row hidden={!editMode}>
                {editModeBtns.map((btn) => (
                  <Col mb={2}>
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
        </Col>
      </>
    </Row>
  )
}

export default ShaddressScreen
