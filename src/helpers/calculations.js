export const Calculations = (cartItems = []) => {
  if (cartItems.length === 0)
    return {
      subtotal: 0,
      productsPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0,
    }

  // number of items, i.e. subtotal
  const subtotal = cartItems.reduce(
    (total, current) => (total += current.qty),
    0
  )

  // add decimals function
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  const productsPrice = cartItems.reduce(
    (total, curr) => total + curr.qty * curr.price,
    0
  )

  // calculating the shipping price
  const shippingPrice = addDecimals(
    productsPrice > 0 ? (productsPrice > 1000 ? 15 : 10) : 10
  )

  const taxPrice = addDecimals((productsPrice * 0.05).toFixed(2))

  const totalPrice = addDecimals(
    Number(productsPrice) + Number(shippingPrice) + Number(taxPrice)
  )

  return {
    subtotal,
    productsPrice: +productsPrice,
    shippingPrice: +shippingPrice,
    taxPrice: +taxPrice,
    totalPrice: +totalPrice,
  }
}

export const cartScreenCalcs = (cartItems = [], qtyLcs) => {
  let lcs = !qtyLcs.isEmpty
  let productsPrice = 0

  if (lcs) {
    let updatedQts = qtyLcs.getQts()
    Object.keys(updatedQts).forEach((id) => {
      for (let i = 0; i < cartItems.length; i++) {
        if (id === cartItems[i]) {
          cartItems[i].qty = updatedQts[id]
          break
        }
      }
    })
  }

  const subtotal = cartItems.reduce(
    (total, current) => (total += current.qty),
    0
  )

  cartItems.forEach((i) => {
    productsPrice += i.qty * i.price
  })

  return { subtotal, productsPrice }
}
