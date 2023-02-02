// libraries & methods
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form as FormikForm } from 'formik'
import * as Yup from 'yup'
// UI components

import { Button, Row, Col } from 'react-bootstrap'
import { Loader, FormContainer, FlashMsg } from '../../components'

// redux actions
import { register } from '../../actions/userActions'
import { MAX_NAME_CHARS, PASSWORD_LENGTH } from '../../config'
import FormikFieldGroup from '../../components/FormikFieldGroup'

const initialValues = { name: '', email: '', password: '', confirmPass: '' }

const formFields = [
  { name: 'name', type: 'text', label: 'Full Name' },
  { name: 'email', type: 'email', label: 'Email Address' },
  { name: 'password', type: 'password', label: 'Password' },
  { name: 'confirmPass', type: 'password', label: 'Confirm Password' },
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
    .max(32, 'Too Long!')
    .required('Please enter your password'),
  confirmPass: Yup.string()
    .min(6, 'Too Short!')
    .max(32, 'Too Long!')
    .required('Please confirm your passowrd'),
})

const RegisterScreen = ({ history }) => {
  // hooks
  const [passError, setPassError] = useState(null)
  // redux related stuff
  const dispatch = useDispatch()
  const { loading: regLoading, error: regError } = useSelector(
    (state) => state.userRegister
  )

  // variables
  let error = regError || passError
  let loading = regLoading

  const handleSubmit = (vals, onSubmitProps) => {
    if (vals.password !== vals.confirmPass) {
      setPassError('Passwords do not match')
      return
    }
    dispatch(register(vals.name, vals.email, vals.password))
    onSubmitProps.setSubmitting(false)
    onSubmitProps.resetForm()
  }

  return (
    <FormContainer>
      <h1>Sign in</h1>
      <FlashMsg variant='danger' permanent>
        {error}
      </FlashMsg>
      <Loader hidden={!loading} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <FormikForm>
          {formFields.map((f, i) => (
            <FormikFieldGroup key={i} formField={f} />
          ))}
          <Button type='submit' className='btn-block' variant='info'>
            Register
          </Button>
        </FormikForm>
      </Formik>
      <Row className='py-3'>
        <Col className='text-center'>
          Already have account?{' '}
          <Link to='/signin'>
            <span className='link'>Login</span>
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
