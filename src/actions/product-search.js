import { API_URL } from "config.json";

/**
 * Action called before and after searching products
 * @param {boolean} isFetching Whether the token is currently being fetched
 * @param {string} status If there was an error during the request, this field should contain it
 * @param {object} products The received products
 * @param {object} total The total count of products found
 * @returns {object} The redux action
 */
const searchProducts = (isFetching, status, products, total) => ({
	type: "SEARCH_PRODUCTS",
	isFetching,
	status,
	products,
	total
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
	form.append("action", "product_search");
	form.append("s", query);
	form.append("version", 2);

	return fetch(API_URL + "/wp-admin/admin-ajax.php", {
		method: "POST",
		body: form
	})
		.then(
			response =>
				response.ok
					? response.json()
					: Promise.reject(new Error("Response wasn't ok!"))
		)
		.then(json => {
			dispatch(searchProducts(false, null, json.products, json.count));
		})
		.catch(error => {
			dispatch(searchProducts(false, error, []));

			return Promise.reject(error);
		});
};
