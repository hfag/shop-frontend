/**
 * The product search reducer
 * @param {Object} state The redux state
 * @param {Object} action The dispatched action
 * @returns {Object} The new state
 */
const productSearchReducer = (
  state = { isFetching: 0, error: null, sections: [], lastQuery: "" },
  action
) => {
  switch (action.type) {
    case "SEARCH_PRODUCTS":
      return {
        isFetching: state.isFetching + (action.isFetching ? 1 : -1),
        error:
          action.error || action.error === null ? action.error : state.error,
        sections: action.sections ? action.sections : state.sections,
        lastQuery: action.query || state.lastQuery
      };
    case "RESET_PRODUCT_SEARCH":
      return { isFetching: 0, error: null, sections: [], lastQuery: "" };
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

/**
 * Returns the last product search query
 * @param {Object} productSearch This part of the redux state
 * @returns {Error} The last query
 */
export const getLastProductSearchQuery = productSearch =>
  productSearch.lastQuery;
