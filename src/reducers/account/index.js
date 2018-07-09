/**
 * The product search reducer
 * @param {Object} state The redux state
 * @param {Object} action The dispatched action
 * @returns {Object} The new state
 */
const accountReducer = (
  state = { isFetching: false, error: null, account: {} },
  action
) => {
  switch (action.type) {
    case "LOGIN_USER":
    case "UPDATE_ACCOUNT":
    case "UPDATE_USER_ADDRESS":
    case "FETCH_USER_ACCOUNT":
      return {
        isFetching: action.isFetching,
        error:
          action.error || action.error === null ? action.error : state.error,
        account:
          !action.isFetching && action.account ? action.account : state.account
      };
    default:
      return state;
  }
};

export default accountReducer;

/**
 * Gets all countries
 * @param {Object} state The redux state
 * @returns {Object} All countries
 */
export const getAccount = state => state.account;
