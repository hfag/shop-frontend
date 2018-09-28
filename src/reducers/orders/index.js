/**
 * The orders reducer
 * @param {Object} state The redux state
 * @param {Object} action The dispatched action
 * @returns {Object} The new state
 */
const ordersReducer = (
  state = { isFetching: 0, lastFetched: 0, error: null, orders: [] },
  action
) => {
  switch (action.type) {
    case "FETCH_ORDERS":
      return {
        isFetching: state.isFetching + (action.isFetching ? 1 : -1),
        error:
          action.error || action.error === null ? action.error : state.error,
        orders: action.orders ? action.orders : state.orders,
        lastFetched:
          !action.isFetching && !action.error ? Date.now() : state.lastFetched
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

/**
 * Gets the last time orders were fetched
 * @param {Object} state The redux state
 * @returns {number} The timestamp
 */
export const getOrdersLastFetched = state => state.lastFetched;
