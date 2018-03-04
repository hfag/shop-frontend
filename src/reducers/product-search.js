/**
 * The product search reducer
 * @param {object} state The redux state
 * @param {object} action The dispatched action
 * @return {object} The new state
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
					action._error || action._error === null
						? action._error
						: state._error,
				sections: action.sections ? action.sections : state.sections
			};
		default:
			return state;
	}
};

export default productSearchReducer;

/**
 * Returns the product list
 * @param {object} productSearch This part of the redux state
 * @return {array} The product array
 */
export const getProductSearchSections = productSearch => productSearch.sections;
/**
 * Checks whether it is currently being fetched
 * @param {object} productSearch This part of the redux state
 * @return {boolean} Whether the token is being fetched
 */
export const getProductSearchFetching = productSearch =>
	productSearch.isFetching;
/**
 * Returns the error
 * @param {object} productSearch This part of the redux state
 * @return {error} The current error
 */
export const getProductSearchError = productSearch => productSearch.error;
