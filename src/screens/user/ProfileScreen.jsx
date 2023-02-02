// -- LIBRARIES --
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// -- COMPONENTS --
import { Spinner, FlashMsg } from '../../components'
import { Row, Col, Button } from 'react-bootstrap'

// -- REDUX RELATED IMPORTS --
import { updateUserProfile } from '../../actions/userActions'
import AccountSideMenu from '../../components/AccountSideMenu'
import { USER_DETAILS_PROPERTY_RESET, USER_INFO_UPDATE } from '../../constants'
import { Formik, Form as FormikForm } from 'formik'
import * as Yup from 'yup'
import { MAX_NAME_CHARS, PASSWORD_LENGTH } from '../../config'
import FormikFieldGroup from '../../components/FormikFieldGroup'
import Meta from '../../components/Meta'

const formFields = [
  { name: 'name', label: 'Name', required: true, type: 'text' },
  { name: 'email', label: 'Email', required: true, type: 'email' },
  { name: 'password', label: 'New Password', type: 'password', editOnly: true },
  {
    name: 'confirmPass',
    label: 'Confirm Password',
    type: 'password',
    editOnly: true,
  },
]

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(MAX_NAME_CHARS, 'Too Long!')
    .required('Please enter your name!'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Please enter your email'),
  password: Yup.string()
    .min(PASSWORD_LENGTH, 'Too Short!')
    .max(32, 'Too Long!'),
  confirmPass: Yup.string().min(6, 'Too Short!').max(32, 'Too Long!'),
})

const ProfileScreen = () => {
  // hooks
  const [updatedVals, setUpdatedVals] = useState({})
  const [editMode, setEditMode] = useState(false)
  const [flashMsg, setFlashMsg] = useState({})

  // -- redux stores --
  const dispatch = useDispatch()
  const {
    loading: updateLoading,
    success: updateSuccess,
    error: updateError,
  } = useSelector((state) => state.userDetailsUpdate)

  // variables
  const { userInfo } = useSelector((state) => state.userLogin)
  const loading = updateLoading

  useEffect(() => {
    if (updateSuccess) {
      dispatch({
        type: USER_INFO_UPDATE,
        payload: updatedVals,
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

  const rxReset = (payload) => {
    dispatch({
      type: USER_DETAILS_PROPERTY_RESET,
      payload,
    })
  }

  const initialValues = {
    name: userInfo?.name,
    email: userInfo?.email,
    password: '',
    confirmPass: '',
  }

  const validated = ({ name, email, password, confirmPass }) => {
    const passwordsDontMatch =
      password !== confirmPass || (!password && confirmPass)
    if (passwordsDontMatch) {
      setFlashMsg({ variant: 'danger', msg: 'Passwords do not match' })
      return false
    }

    const notModified =
      name === userInfo.name && email === userInfo.email && !password
    if (notModified) {
      setEditMode(false)
      return false
    }
    return true
  }

  const handleUpdate = ({ name, email, password }) => {
    setUpdatedVals({ name, email })
    dispatch(
      updateUserProfile({
        name,
        email,
        password: password || undefined,
      })
    )
  }

  const handleSubmit = (vals) => {
    if (!validated(vals)) return
    handleUpdate(vals)
  }

  return (
    <Row>
      <Meta title={userInfo && `${userInfo.name} | Profile`} />
      <Spinner hidden={!loading} />
      <Col md={2} sm={2}>
        <AccountSideMenu active={1} />
      </Col>
      <Col md={10} sm={10} hidden={!userInfo}>
        <h3>User Profile</h3>
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
              <FormikFieldGroup
                key={i}
                formField={f}
                hidden={!editMode && f.editOnly}
                isMandatoryField={editMode && f.required}
                readOnly={!editMode}
              />
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
              <Col mb={2}>
                <Button
                  type='reset'
                  className='btn-block'
                  variant='secondary'
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
              </Col>
              <Col mb={2}>
                <Button type='submit' className='btn-block' variant='success'>
                  Save
                </Button>
              </Col>
            </Row>
          </FormikForm>
        </Formik>
      </Col>
    </Row>
  )
}

export default ProfileScreen
