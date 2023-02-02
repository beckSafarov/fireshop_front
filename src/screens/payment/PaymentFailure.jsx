import React from 'react'
import { Container } from 'react-bootstrap'
import { getURLParam } from '../../helpers/utilities'

const PaymentFailure = () => {
  const error = getURLParam('error')

  return (
    <Container>
      <h2>Payment Failed!</h2>
      <div className='mt-20'>
        <p>Sorry! Your payment failed with the following error: </p>
        <div className='error-message-field'>
          <p>{error}</p>
        </div>
        <p>
          Please contact us with the screenshot at{' '}
          <a href='mailto:support@fireshop.com'>support@fireshop.com</a>
        </p>
      </div>
    </Container>
  )
}

export default PaymentFailure
