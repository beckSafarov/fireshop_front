import React from 'react'
import Spinner from 'react-bootstrap/Spinner'

const MySpinner = ({ hidden }) => {
  return !hidden ? (
    <div className='loader-container'>
      <Spinner variant='info' animation='border' role='status'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    </div>
  ) : (
    <></>
  )
}
MySpinner.defaultProps = {
  hidden: false,
}

export default MySpinner
