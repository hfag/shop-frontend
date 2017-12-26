import {
	createFetchSingleItemAction,
	createFetchSingleItemThunk,
	createFetchItemsAction,
	createFetchAllItemsThunk
} from "utilities/action";

const itemName = "attachment";

/**
 * Maps an item so we can store it in the state
 * @param {object} item The item to map
 * @return {object} The mapped item
 */
const mapItem = ({
	id,
	date,
	caption,
	mime_type: mimeType,
	media_details: { width, height, sizes },
	source_url: url
}) => ({
	id,
	date,
	caption,
	mimeType,
	width,
	height,
	url,
	sizes
});

/**
 * Action called before and after fetching an item
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} status If there was an error during the request, this field should contain it
 * @param {object} item The received item
 * @returns {object} The redux action
 */
const fetchItem = createFetchSingleItemAction(itemName);

/**
 * Fetches a single item
 * @param {number} itemId The id of the requested item
 * @returns {function}
 */
export const fetch = createFetchSingleItemThunk(
	fetchItem,
	id => `/wp-json/wp/v2/media/${id}`,
	mapItem
);

/**
 * Action called before and after fetching all items
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} status If there was an error during the request, this field should contain it
 * @param {object} items The received items
 * @returns {object} The redux action
 */
const fetchItems = createFetchItemsAction(itemName);

/**
 * Fetches all items
 * @returns {function}
 */
export const fetchAll = createFetchAllItemsThunk(
	fetchItems,
	(page, perPage) => `/wp-json/wp/v2/media?page=${page}&per_page=${perPage}`,
	response => parseInt(response.headers.get("x-wp-total")),
	mapItem
);
