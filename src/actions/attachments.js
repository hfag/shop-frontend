import {
	createFetchSingleItemAction,
	createFetchSingleItemThunk,
	createFetchItemsAction,
	createFetchAllItemsThunk,
	createFetchItemPageThunk
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
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {object} item The received item
 * @returns {object} The redux action
 */
const fetchItem = createFetchSingleItemAction(itemName);

/**
 * Fetches a single item
 * @param {number} itemId The id of the requested item
 * @returns {function}
 */
export const fetchAttachment = createFetchSingleItemThunk(
	fetchItem,
	id => `/wp-json/wp/v2/media/${id}`,
	mapItem
);

/**
 * Action called before and after fetching all items
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {object} items The received items
 * @param {array} itemIds If specified only items with the specified item ids will be fetched
 * @param {string} order Whether the items should be order asc or desc
 * @param {string} orderby What the items should by ordered by
 * @return {object} The redux action
 */
const fetchItemsAction = createFetchItemsAction(
	itemName,
	"itemIds",
	"order",
	"orderby"
);

/**
 * Fetches the specified items
 * @param {number} page The first page to fetch
 * @param {number} pageTo The last page to fetch, -1 for all
 * @param {number} perPage How many items should be fetched per page
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {array} itemIds Only the specified product ids will be fetched
 * @param {string} order Whether the items should be order asc or desc
 * @param {string} orderby What the items should by ordered by
 * @return {function}
 */
export const fetchAttachments = createFetchItemPageThunk(
	fetchItemsAction,
	(
		page,
		perPage,
		itemIds = [],
		categoryIds = [],
		order = "desc",
		orderby = "date"
	) =>
		`/wp-json/wp/v2/product?page=${page}&per_page=${perPage}${
			itemIds.length > 0 ? "&include[]=" + itemIds.join("&include[]=") : ""
		}&orderby=${orderby}&order=${order}`,
	mapItem
);
