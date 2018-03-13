import {
	createFetchAction,
	createFetchSingleItemAction,
	createFetchSingleItemThunk,
	createFetchItemsAction,
	createFetchAllItemsThunk,
	createFetchItemPageThunk,
	createFetchItemPageAction
} from "utilities/action";

import {
	fetchAttachmentsAction,
	mapItem as mapAttachment
} from "actions/attachments";

const itemName = "productCategory";

/**
 * Maps an item so we can store it in the state
 * @param {object} item The item to map
 * @return {object} The mapped item
 */
const mapItem = ({
	id,
	count,
	description,
	name,
	slug,
	parent,
	thumbnail
}) => ({
	id,
	count,
	description,
	name,
	slug,
	parent,
	thumbnailId: thumbnail && thumbnail.id ? thumbnail.id : -1
});

const afterCategoryFetch = (dispatch, response, items) => {
	dispatch(
		fetchAttachmentsAction(
			false,
			null,
			false,
			items
				.map(cat => cat.thumbnail)
				.filter(t => t)
				.map(mapAttachment)
		)
	);
};

/**
 * Action called before and after fetching an item
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {object} item The received item
 * @return {object} The redux action
 */
const fetchItemAction = createFetchSingleItemAction(itemName);

/**
 * Fetches a single item
 * @param {number} itemId The id of the requested item
 * @returns {function}
 */
export const fetchProductCategory = createFetchSingleItemThunk(
	fetchItemAction,
	id => `/wp-json/wp/v2/product_cat/${id}`,
	mapItem
);

/**
 * Action called before and after fetching multiple items
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {object} items The received items
 * @return {object} The redux action
 */
const fetchItemsAction = createFetchItemsAction(itemName);

/**
 * Fetches all items
 * @param {number} perPage How many items should be fetched per page
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @returns {function} The redux thunk
 */
export const fetchAllProductCategories = createFetchAllItemsThunk(
	fetchItemsAction,
	(page, perPage) =>
		`/wp-json/wp/v2/product_cat?page=${page}&per_page=${perPage}`,
	mapItem,
	afterCategoryFetch
);

/**
 * Action called before and after fetching an item page
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {object} items The received items
 * @param {array} itemIds The item ids to fetch
 * @return {object} The redux action
 */
const fetchItemPageAction = createFetchItemPageAction(itemName, "itemIds");

/**
 * Fetches specified items
 * @param {number} perPage How many items should be fetched per page
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {array} itemIds The item ids to fetch
 * @return {function} The redux thunk
 */
export const fetchProductCategories = createFetchAllItemsThunk(
	fetchItemPageAction,
	(page, perPage, itemIds = []) =>
		`/wp-json/wp/v2/product_cat?page=${page}&per_page=${perPage}${
			itemIds.length > 0 ? `&include[]=${itemIds.join("&include[]=")}` : ""
		}`,
	mapItem,
	afterCategoryFetch
);
