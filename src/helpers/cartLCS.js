export const getCart = () =>
  JSON.parse(localStorage.getItem('cartItems')) || [];

const setCart = (cart) =>
  localStorage.setItem('cartItems', JSON.stringify(cart));

export const have = (newItem) =>
  getCart().find((item) => item._id === newItem._id);

export const add = (product) => {
  let cart = getCart();
  let modified = false;
  const more = modified ? 'more' : '';
  const message = `You added ${product.qty} ${more} ${product.name}(s) to your shopping cart`;

  cart.forEach((item, index) => {
    if (item._id === product._id) {
      cart[index].qty += product.qty;
      modified = true;
    }
  });

  cart = modified ? cart : [...cart, product];
  setCart(cart);

  return {
    cart,
    message,
  };
};

export const remove = (product) => {
  let cart = getCart();
  cart = cart.filter((item) => item._id !== product._id);
  setCart(cart);
  return cart;
};

export const qtyUpdate = (product) => {
  let cart = getCart();
  cart.forEach((item) => {
    if (item._id === product._id) item.qty = product.qty;
  });
  setCart(cart);
  return cart;
};

export const flushCart = () => setCart([]);
