import React from 'react'
import { Nav } from 'react-bootstrap'
import NavLink from '../NavLink'

const CheckOutSteps = ({ step: stepNumber }) => {
  const steps = [
    { link: '/shipping', label: 'Shipping' },
    { link: '/payment', label: 'Payment' },
    { link: '/placeorder', label: 'Place Order' },
  ]
  return (
    <Nav className='justify-content-center mb-4'>
      {steps.map((step, i) => (
        <Nav.Item key={i}>
          <NavLink to={step.link} disabled={i + 1 > stepNumber}>
            {step.label}
          </NavLink>
        </Nav.Item>
      ))}
    </Nav>
  )
}

CheckOutSteps.defaultProps = {
  step: 1,
}

export default CheckOutSteps
