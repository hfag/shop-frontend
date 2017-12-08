/**
 * The product search reducer
 * @param {object} state The redux state
 * @param {object} action The dispatched action
 * @return {object} The new state
 */
const productSearchReducer = (
	state = { isFetching: false, status: null, sections: [] },
	action
) => {
	switch (action.type) {
		case "SEARCH_PRODUCTS":
			return {
				isFetching: action.isFetching,
				status:
					action.status || action.status === null
						? action.status
						: state.status,
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
 * Returns the status
 * @param {object} productSearch This part of the redux state
 * @return {error} The current status
 */
export const getProductSearchStatus = productSearch => productSearch.status;
