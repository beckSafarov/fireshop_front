import React from 'react'
import { Image } from 'react-bootstrap'

const EmptyCart = ({ hidden }) => {
  return !hidden ? (
    <div className='empty-cart-container'>
      <h2>Your Cart is Empty!</h2>
      <div className='my-5'>
        <Image
          src={'/images/emptycart.png'}
          alt={'Empty Cart'}
          height={300}
          width={300}
          fluid
          rounded
        />
      </div>
    </div>
  ) : (
    <></>
  )
}

EmptyCart.defaultProps = {
  hidden: false,
}

export default EmptyCart
