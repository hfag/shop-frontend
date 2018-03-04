import { fetchApi } from "utilities/api";
import { createFetchAction, createFetchItemsThunk } from "utilities/action";

const mapItem = section => section;

/**
 * Action called before and after searching products
 * @param {boolean} isFetching Whether the token is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {object} query The search query
 * @param {object} sections The received suggestion sections
 * @returns {object} The redux action
 */
const searchProducts = createFetchAction(
	"SEARCH_PRODUCTS",
	"query",
	"sections"
);

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
export const search = createFetchItemsThunk(
	searchProducts,
	query => `/wp-json/hfag/suggestions?query=${query}`,
	mapItem
);
