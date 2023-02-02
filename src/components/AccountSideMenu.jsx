import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const AccountSideMenu = ({ active }) => {
  const links = [
    { to: '/profile', label: 'Profile' },
    { to: '/address', label: 'Address' },
  ]

  return (
    <ListGroup variant='flush'>
      {links.map((link, i) => (
        <LinkContainer to={link.to} key={i}>
          <ListGroup.Item active={active === i + 1} action={active !== i + 1}>
            {link.label}
          </ListGroup.Item>
        </LinkContainer>
      ))}
    </ListGroup>
  )
}

export default AccountSideMenu
