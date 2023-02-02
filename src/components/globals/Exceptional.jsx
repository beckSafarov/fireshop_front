import React from 'react'
import { Alert } from 'react-bootstrap'

const Exceptional = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>
}

Exceptional.defaultProps = {
  variant: 'danger',
  children: 'System Error. Please contact support at support@fireshop.com',
}

export default Exceptional
