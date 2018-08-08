/**
 * The sales reducer
 * @param {Object} state The redux state
 * @param {Object} action The dispatched action
 * @returns {Object} The new state
 */
const salesReducer = (
  state = { isFetching: false, error: null, sales: [] },
  action
) => {
  switch (action.type) {
    case "FETCH_SALES":
      return {
        isFetching: action.isFetching,
        error:
          action.error || action.error === null ? action.error : state.error,
        sales: !action.isFetching && action.sales ? action.sales : state.sales
      };
    default:
      return state;
  }
};

export default salesReducer;

/**
 * Gets all sales
 * @param {Object} state The redux state
 * @returns {Object} All sales
 */
export const getSales = state => state.sales;
