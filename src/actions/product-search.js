import { createFetchAction, createFetchItemsThunk } from "utilities/action";

/**
 * Maps the received object properties to the ones that should be stored in the state
 * @param {Object} section The item to map
 * @returns {Object} The mapped item
 */
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
  "sections",
  "query"
);

/**
 * Clears the product search array
 * @returns {Object} The redux action
 */
export const reset = () => ({
  type: "RESET_PRODUCT_SEARCH"
});

/**
 * Searches for products
 * @param {string} language The language string
 * @param {boolean} visualize Whether to visualize the progress of the request
 * @param {string} query The search query
 * @returns {function} A redux thunk
 */
export const search = createFetchItemsThunk(
  searchProducts,
  (language, query) => `${language}/wp-json/hfag/suggestions?query=${query}`,
  mapItem
);
