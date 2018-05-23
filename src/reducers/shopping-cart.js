/**
 * The shopping cart reducer
 * @param {Object} state The redux state
 * @param {Object} action The dispatched action
 * @returns {Object} The new state
 */
const shoppingCartReducer = (
  state = {
    isFetching: false,
    error: null,
    items: [],
    total: 0,
    shipping: 0,
    taxes: [],
    fees: []
  },
  action
) => {
  switch (action.type) {
    case "FETCH_SHOPPING_CART":
    case "UPDATE_SHOPPING_CART":
      return {
        isFetching: action.isFetching,
        error:
          action._error || action._error === null
            ? action._error
            : state._error,
        items:
          action.cart && action.cart.items ? action.cart.items : state.items,
        total:
          action.cart && action.cart.total ? action.cart.total : state.total,
        taxes:
          action.cart && action.cart.taxes ? action.cart.taxes : state.taxes,
        fees: action.cart && action.cart.fees ? action.cart.fees : state.fees,
        shipping:
          action.cart && action.cart.shipping
            ? action.cart.shipping
            : state.shipping
      };
    default:
      return state;
  }
};

export default shoppingCartReducer;

/**
 * Retrieves the latest fetch error
 * @param {Object} state The redux state
 * @returns {Error} The fetch error
 */
export const getShoppingCartError = state => state.error;
/**
 * Checks whether the shopping cart is currently being fetched
 * @param {Object} state The redux state
 * @returns {boolean} Whether the cart is currently being fetched
 */
export const getShoppingCartFetching = state => state.isFetching;
/**
 * Gets all items that are currenlty in the shopping cart
 * @param {Object} state The redux state
 * @returns {Array} The cart items
 */
export const getShoppingCartItems = state => state.items;

/**
 * Gets the total price of the cart
 * @param {Object} state The redux state
 * @returns {number} The sum
 */
export const getShoppingCartTotal = state => state.total;

/**
 * Gets the shopping cart taxes
 * @param {Object} state The redux state
 * @returns {number} The taxes
 */
export const getShoppingCartTaxes = state => state.taxes;

/**
 * Gets the shopping cart fees
 * @param {Object} state The redux state
 * @returns {number} The fees
 */
export const getShoppingCartFees = state => state.fees;

/**
 * Gets the shopping shipping
 * @param {Object} state The redux state
 * @returns {number} The shipping
 */
export const getShoppingCartShipping = state => state.shipping;
