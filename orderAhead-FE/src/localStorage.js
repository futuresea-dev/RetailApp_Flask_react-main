export const loadCartItems = () => {
  try {
    const serializedState = localStorage.getItem('cartItems')
    if (serializedState === null) {
      return []
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return []
  }
}

export const saveCartItems = (cartItems) => {
  try {
    const serializedState = JSON.stringify(cartItems)
    localStorage.setItem('cartItems', serializedState)
  } catch(err) {
    // Ignore write errors
  }
}