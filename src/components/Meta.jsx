import React from 'react'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation } from 'react-router-dom'

const Meta = ({ title: passedTitle, description, keywords }) => {
  const { pathname: path } = useLocation()
  const [title, setTitle] = useState(passedTitle)

  useEffect(() => {
    setTitle(passedTitle)
    if (!passedTitle) handleTitle()
  }, [path])

  const handleTitle = () => {
    if (path === '/') {
      setTitle('FireShop')
      return
    }
    const titleLookup = {
      cart: 'FireShop | Cart',
      myorders: 'FireShop | Orders',
      shipping: 'FireShop | Shipping',
      payment: 'FireShop | Payment Method',
      purchases: 'FireShop | My Purchases',
      placeorder: 'FireShop | Place Order',
      'payment-success': 'Payment Success',
      'payment-error': 'Payment Failed',
      userslist: 'Users List',
      productlist: 'Products List',
      orderslist: 'Orders List',
    }
    const page = path.split('/').pop()
    setTitle(titleLookup[page] || 'FireShop')
  }

  return (
    <Helmet>
      <meta charSet='utf-8' />
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      <title>{title}</title>
    </Helmet>
  )
}

Meta.defaultProps = {
  description: 'Awesome electronics and other stuff',
  keywords: 'electronics, cheap electronics, cheap stuff',
}

export default Meta
