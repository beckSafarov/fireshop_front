import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loader = ({ hidden }) => {
  return !hidden ? (
    <Spinner
      animation='border'
      role='status'
      style={{
        width: '100px',
        height: '100px',
        margin: 'auto',
        display: 'block',
      }}
    >
      <span className='sr-only'></span>
    </Spinner>
  ) : (
    <></>
  )
}

Loader.defaultProps = {
  hidden: false,
}

export default Loader
