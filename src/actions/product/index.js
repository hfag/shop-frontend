import {
	createFetchSingleItemAction,
	createFetchSingleItemThunk,
	createFetchItemsAction,
	createFetchAllItemsThunk,
	createFetchItemsThunk,
	createFetchItemPageThunk
} from "utilities/action";

const itemName = "product";

/**
 * Maps an item so we can store it in the state
 * @param {object} item The item to map
 * @return {object} The mapped item
 */
const mapItem = (
	{
		id,
		title: { rendered: title },
		content: { rendered: content },
		excerpt: { rendered: excerpt },
		featured_media: thumbnailId,
		product_cat: categoryIds,
		date
	},
	page,
	args
) => ({
	id,
	title,
	content,
	excerpt,
	thumbnailId,
	categoryIds,
	date
});

/**
 * Action called before and after fetching an item
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} status If there was an error during the request, this field should contain it
 * @param {object} item The received item
 * @return {object} The redux action
 */
const fetchItemAction = createFetchSingleItemAction(itemName);

/**
 * Fetches a single item
 * @param {number} itemId The id of the requested item
 * @returns {function}
 */
export const fetchItem = createFetchSingleItemThunk(
	fetchItemAction,
	id => `/wp-json/wp/v2/product/${id}`,
	mapItem
);

/**
 * Action called before and after fetching all items
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} status If there was an error during the request, this field should contain it
 * @param {object} items The received items
 * @return {object} The redux action
 */
const fetchItemsAction = createFetchItemsAction(itemName);

/**
 * Fetches all items
 * @return {function}
 */
export const fetchAll = createFetchAllItemsThunk(
	fetchItemsAction,
	(page, perPage) => `/wp-json/wp/v2/product?page=${page}&per_page=${perPage}`,
	response => parseInt(response.headers.get("x-wp-total")),
	mapItem
);

/**
 * Fetches the specified items
 * @return {function}
 */
export const fetchItems = createFetchItemPageThunk(
	fetchItemsAction,
	(
		page,
		perPage,
		{ itemIds = [], categoryIds = [], order = "desc", orderby = "date" }
	) =>
		`/wp-json/wp/v2/product?page=${page}&per_page=${perPage}${
			itemIds.length > 0 ? "&include[]=" + itemIds.join("&include[]=") : ""
		}${
			categoryIds.length > 0
				? "&product_cat[]=" + categoryIds.join("&product_cat[]=")
				: ""
		}&orderby=${orderby}&order=${order}`,
	response => parseInt(response.headers.get("x-wp-total")),
	mapItem
);
