import {
	createFetchSingleItemAction,
	createFetchSingleItemThunk,
	createFetchAllItemsAction,
	createFetchAllItemsThunk
} from "utilities/action";

const itemName = "productCategory";

/**
 * Maps an item so we can store it in the state
 * @param {object} category The item to map
 * @return {object} The mapped item
 */
const mapItem = ({
	id,
	count,
	description,
	name,
	slug,
	parent,
	thumbnail_id: thumbnailId
}) => ({
	id,
	count,
	description,
	name,
	slug,
	parent,
	thumbnailId
});

/**
 * Action called before and after fetching an item
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} status If there was an error during the request, this field should contain it
 * @param {object} category The received item
 * @returns {object} The redux action
 */
const fetchItem = createFetchSingleItemAction(itemName);

/**
 * Fetches a single item
 * @param {number} categoryId The id of the requested item
 * @returns {function}
 */
export const fetch = createFetchSingleItemThunk(
	fetchItem,
	id => `/wp-json/wp/v2/product_cat/${id}`,
	mapItem
);

/**
 * Action called before and after fetching all items
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} status If there was an error during the request, this field should contain it
 * @param {object} categories The received categories
 * @returns {object} The redux action
 */
const fetchItems = createFetchAllItemsAction(itemName);

/**
 * Fetches all items
 * @returns {function}
 */
export const fetchAll = createFetchAllItemsThunk(
	fetchItems,
	(page, perPage) =>
		`/wp-json/wp/v2/product_cat?page=${page}&per_page=${perPage}`,
	response => parseInt(response.headers.get("x-wp-total")),
	mapItem
);
