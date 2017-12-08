import { fetchApi as fetch } from "api-utilities";

/**
 * Action called before and after searching products
 * @param {boolean} isFetching Whether the token is currently being fetched
 * @param {string} status If there was an error during the request, this field should contain it
 * @param {object} sections The received suggestion sections
 * @returns {object} The redux action
 */
const searchProducts = (isFetching, status, sections) => ({
	type: "SEARCH_PRODUCTS",
	isFetching,
	status,
	sections
});

/**
 * Clears the product search array
 * @returns {object} The redux action
 */
export const reset = () => ({
	type: "RESET_PRODUCT_SEARCH"
});

/**
 * Searches for products
 * @param {string} query The search query
 * @returns {function} A redux thunk
 */
export const search = query => dispatch => {
	dispatch(searchProducts(true, null));

	const form = new FormData();

	return fetch("/wp-json/hfag/suggestions?query=" + query, {
		method: "GET"
	})
		.then(response => response.json())
		.then(sections => {
			dispatch(searchProducts(false, null, sections));
		})
		.catch(error => {
			dispatch(searchProducts(false, error, []));

			return Promise.reject(error);
		});
};
