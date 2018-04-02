import {
	createFetchSingleItemAction,
	createFetchSingleItemThunk,
	createFetchItemsAction,
	createFetchAllItemsThunk,
	createFetchItemPageThunk,
	createFetchItemPageAction,
	createFetchItemsThunk
} from "utilities/action";

import {
	fetchAttachmentsAction,
	mapItem as mapAttachment
} from "actions/attachments";

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
 * Maps an item so we can store it in the state
 * @param {object} item The item to map
 * @return {object} The mapped item
 */
const mapVariation = ({
	attributes,
	dimensions,
	weight,
	image_id: imageId,
	display_price: price,
	is_in_stock: isInStock,
	is_purchasable: isPurchasable,
	is_sold_individually: isSoldIndividually,
	is_virtual: isVirtual,
	max_qty: maxQty,
	min_qty: minQty,
	sku,
	variation_description: description,
	variation_id: id
}) => ({
	id: parseInt(id),
	description,
	sku,
	imageId: parseInt(imageId),
	dimensions,
	weight: parseFloat(weight),
	minQty: parseInt(minQty),
	maxQty: parseInt(maxQty),
	isInStock,
	isPurchasable,
	isSoldIndividually,
	isVirtual,
	attributes: Object.keys(attributes).reduce((object, attributeKey) => {
		if (attributeKey.startsWith("attribute_")) {
			object[attributeKey.replace("attribute_", "")] = attributes[attributeKey];
		} else {
			object[attributeKey] = attributes[attributeKey];
		}

		return object;
	}, {})
});

/**
 * Action called before and after fetching an item
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {object} item The received item
 * @return {object} The redux action
 */
const fetchItemAction = createFetchSingleItemAction(itemName);

/**
 * Fetches a single item
 * @param {number} itemId The id of the requested item
 * @returns {function}
 */
export const fetchProduct = createFetchSingleItemThunk(
	fetchItemAction,
	id => `/wp-json/wp/v2/product/${id}`,
	mapItem
);

/**
 * Action called before and after fetching an item page
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {object} items The received items
 * @return {object} The redux action
 */
const fetchItemPageAction = createFetchItemPageAction(itemName);

/**
 * Fetches all items
 * @param {number} perPage How many items should be fetched per page
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @return {function}
 */
export const fetchAllProducts = createFetchAllItemsThunk(
	fetchItemPageAction,
	(page, perPage) => `/wp-json/wp/v2/product?page=${page}&per_page=${perPage}`,
	mapItem
);

/**
 * Action called before and after fetching all items
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {object} items The received items
 * @param {array} itemIds If specified only items with the specified item ids will be fetched
 * @param {array} categoryIds If specified only items of the given categories will be fetched
 * @param {string} order Whether the items should be order asc or desc
 * @param {string} orderby What the items should by ordered by
 * @return {object} The redux action
 */
const fetchItemsAction = createFetchItemsAction(
	itemName,
	"itemIds",
	"categoryIds",
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
 * @param {array} categoryIds If specified only items of the given categories will be fetched
 * @param {string} order Whether the items should be order asc or desc
 * @param {string} orderby What the items should by ordered by
 * @return {function}
 */
export const fetchProducts = createFetchItemPageThunk(
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
		}${
			categoryIds.length > 0
				? "&product_cat[]=" + categoryIds.join("&product_cat[]=")
				: ""
		}&orderby=${orderby}&order=${order}&_embed`,
	mapItem,
	(dispatch, response, items) => {
		dispatch(
			fetchAttachmentsAction(
				false,
				null,
				false,
				items
					.map(product => product._embedded["wp:featuredmedia"][0])
					.filter(t => t)
					.map(mapAttachment)
			)
		);
	}
);

/**
 * Action called before and after fetching all items
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {object} items The received items
 * @param {array} productId The productId these variations are related to
 * @return {object} The redux action
 */
const fetchVariationsAction = createFetchItemsAction(
	"product_variation",
	"productId"
);

/**
 * Fetches all product variations for one product
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {array} productId The productId these variations are related to
 * @return {function}
 */
export const fetchVariations = createFetchItemsThunk(
	fetchVariationsAction,
	productId => `/wp-json/hfag/product-variations?productId=${productId}`,
	mapVariation,
	(dispatch, items) => {
		dispatch(
			fetchAttachmentsAction(
				false,
				null,
				false,
				items
					.map(variation => variation.image)
					.filter(t => t)
					.map(mapAttachment)
			)
		);
	}
);
