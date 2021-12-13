export const range = (start, stop, step) => {
  if (typeof stop == 'undefined') {
      // one param defined
      stop = start;
      start = 0;
  }

  if (typeof step == 'undefined') {
      step = 1;
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
      return [];
  }

  var result = [];
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
      result.push(i);
  }

  return result;
};


const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

export const formatPrice = value => formatter.format(value)


export const getCartItemPrice = (cartItem) => {
  let price = 0

  console.log(cartItem)

  if (cartItem.tierInfo) {
    price = cartItem.tierInfo.pricePerUnitInMinorUnits / 100
  } else {
    price = cartItem.product.price
  }

  return price
}

export const getCartItemOption = (cartItem) => {
    let option = ''

    if (cartItem.tierInfo) {
        option = convertTierLabel(cartItem.tierInfo.name)
    }
    return option
}

export const convertTierLabel = (text) => {
    const mappingTable = {
        gram: '1g',
        halfEighth: '1/16 oz',
        eighth: '1/8 oz',
        quarter: '1/4 oz',
        halfOunce: '1/2 oz',
        ounce: '1 oz',
    }

    return mappingTable[text]
}