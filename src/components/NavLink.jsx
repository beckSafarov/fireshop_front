import { LinkContainer } from 'react-router-bootstrap'
import { Nav } from 'react-bootstrap'

import React from 'react'

const NavLink = ({ to, disabled, children }) => {
  return (
    <LinkContainer to={to}>
      <Nav.Link disabled={disabled}>{children}</Nav.Link>
    </LinkContainer>
  )
}

NavLink.defaultProps = {
  to: '/',
  disabled: false,
}

export default NavLink
