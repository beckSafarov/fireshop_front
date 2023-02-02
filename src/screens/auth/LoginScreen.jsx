import { Link, useLocation } from 'react-router-dom'
import { Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form as FormikForm } from 'formik'
import * as Yup from 'yup'
// internal components
import { FlashMsg, FormContainer, Message, Spinner } from '../../components'
// redux actions
import { login } from '../../actions/userActions'
import FormikFieldGroup from '../../components/FormikFieldGroup'
const initialValues = { email: '', password: '' }

const formFields = [
  { name: 'email', type: 'email', label: 'Email Address' },
  { name: 'password', type: 'password', label: 'Password' },
]

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Please enter your email'),
  password: Yup.string()
    .min(6, 'Too Short!')
    .max(32, 'Too Long!')
    .required('Please enter your password'),
})

const LoginScreen = ({ history }) => {
  // redux stuff
  const dispatch = useDispatch()
  const { loading, error: loginError } = useSelector((state) => state.userLogin)

  // variables
  const redirect =
    new URLSearchParams(useLocation().search).get('redirect') || '/'

  const handleSubmit = (vals, onSubmitProps) => {
    onSubmitProps.resetForm()
    onSubmitProps.setSubmitting(false)
    dispatch(login(vals.email, vals.password))
  }

  return (
    <FormContainer>
      <h1>Sign in</h1>
      <Spinner hidden={!loading} />
      <FlashMsg variant='danger' permanent>
        {loginError}
      </FlashMsg>
      <div className='py-4'>
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
              Sign in
            </Button>
            <Row className='py-3'>
              <Col className='text-center'>
                New Customer?{' '}
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : '/register'}
                >
                  <span className='link'>Register</span>
                </Link>
              </Col>
            </Row>
          </FormikForm>
        </Formik>
      </div>
    </FormContainer>
  )
}

export default LoginScreen
