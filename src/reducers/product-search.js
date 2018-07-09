/**
 * The product search reducer
 * @param {Object} state The redux state
 * @param {Object} action The dispatched action
 * @returns {Object} The new state
 */
const productSearchReducer = (
  state = { isFetching: false, error: null, sections: [] },
  action
) => {
  switch (action.type) {
    case "SEARCH_PRODUCTS":
      return {
        isFetching: action.isFetching,
        error:
          action.error || action.error === null ? action.error : state.error,
        sections: action.sections ? action.sections : state.sections
      };
    default:
      return state;
  }
};

export default productSearchReducer;

/**
 * Returns the product list
 * @param {Object} productSearch This part of the redux state
 * @returns {Array} The product array
 */
export const getProductSearchSections = productSearch => productSearch.sections;
/**
 * Checks whether it is currently being fetched
 * @param {Object} productSearch This part of the redux state
 * @returns {boolean} Whether the token is being fetched
 */
export const getProductSearchFetching = productSearch =>
  productSearch.isFetching;
/**
 * Returns the error
 * @param {Object} productSearch This part of the redux state
 * @returns {Error} The current error
 */
export const getProductSearchError = productSearch => productSearch.error;
