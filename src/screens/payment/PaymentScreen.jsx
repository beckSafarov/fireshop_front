import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod } from '../../actions/cartActions'

// UI components
import { Form, Button, Col } from 'react-bootstrap'
import { FormContainer, CheckOutSteps } from '../../components'
import { withRouter } from 'react-router-dom'

const PaymentScreen = ({ history }) => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  const { userInfo } = useSelector((state) => state.userLogin)
  const { shippingAddress, cartItems } = userInfo
  const dispatch = useDispatch()

  useEffect(() => {
    if (userInfo) {
      !shippingAddress && history.push('/shipping')
      cartItems.length === 0 && history.push('/')
    }
  }, [userInfo, history])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    history.push('/placeorder')
  }

  return (
    <FormContainer>
      <CheckOutSteps step={2} />
      <h1>Payment Method</h1>
      <Form onSubmit={handleSubmit} className='py-3'>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              type='radio'
              label='PayPal/Credit Card'
              id='PayPal'
              name='paymentMethod'
              value='Paypal'
              checked
              onChange={(e) => {
                setPaymentMethod(e.target.value)
              }}
            ></Form.Check>
            <Form.Check
              type='radio'
              label='Stripe'
              id='Stripe'
              name='paymentMethod'
              value='Stripe'
              onChange={(e) => {
                setPaymentMethod(e.target.value)
              }}
            ></Form.Check>
          </Col>
        </Form.Group>

        <div className='py-4'>
          <Button className='rounded-btn' type='submit' variant='success' block>
            Continue
          </Button>
        </div>
      </Form>
    </FormContainer>
  )
}

export default withRouter(PaymentScreen)
