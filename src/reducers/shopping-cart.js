/**
 * The shopping cart reducer
 * @param {Object} state The redux state
 * @param {Object} action The dispatched action
 * @returns {Object} The new state
 */
const shoppingCartReducer = (
  state = {
    isFetching: 0,
    lastFetched: 0,
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
    case "ADD_SHOPPING_CART_ITEM":
    case "UPDATE_SHOPPING_CART":
      return {
        isFetching: state.isFetching + (action.isFetching ? 1 : -1),
        lastFetched: !action.isFetching && !action.error ? Date.now() : state,
        error:
          action.error || action.error === null ? action.error : state.error,
        items:
          action.cart && action.cart.items ? action.cart.items : state.items,
        total:
          action.cart && action.cart.total !== null
            ? action.cart.total
            : state.total,
        taxes:
          action.cart && action.cart.taxes ? action.cart.taxes : state.taxes,
        fees: action.cart && action.cart.fees ? action.cart.fees : state.fees,
        shipping:
          action.cart && action.cart.shipping !== null
            ? action.cart.shipping
            : state.shipping
      };
    case "CLEAR_SHOPPING_CART":
      return {
        isFetching: 0,
        lastFetched: 0,
        error: null,
        items: [],
        total: 0,
        shipping: 0,
        taxes: [],
        fees: []
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
export const isFetchingShoppingCart = state => state.isFetching !== 0;
/**
 * Gets when the shopping cart was fetched for the last time
 * @param {Object} state The redux state
 * @returns {number} The last time the shopping cart was fetched
 */
export const getShoppingCartLastFetched = state => state.lastFetched;
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
