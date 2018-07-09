/**
 * The orders reducer
 * @param {Object} state The redux state
 * @param {Object} action The dispatched action
 * @returns {Object} The new state
 */
const ordersReducer = (
  state = { isFetching: false, error: null, orders: [] },
  action
) => {
  switch (action.type) {
    case "FETCH_ORDERS":
      return {
        isFetching: action.isFetching,
        error:
          action.error || action.error === null ? action.error : state.error,
        orders: action.orders ? action.orders : state.orders
      };
    default:
      return state;
  }
};

export default ordersReducer;

/**
 * Gets all orders
 * @param {Object} state The redux state
 * @returns {Object} All orders
 */
export const getOrders = state => state.orders;
