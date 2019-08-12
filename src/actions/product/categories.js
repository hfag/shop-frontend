import {
  createFetchSingleItemAction,
  createFetchSingleItemThunk,
  createFetchItemsAction,
  createFetchAllItemsThunk,
  createFetchItemPageAction
} from "utilities/action";
import {
  fetchAttachmentsAction,
  mapItem as mapAttachment
} from "actions/attachments";

import {
  getProductCategoriesLastFetched,
  getProductCategories,
  isFetchingProductCategories
} from "../../reducers";

const itemName = "productCategory";

/**
 * Maps an item so we can store it in the state
 * @param {Object} item The item to map
 * @returns {Object} The mapped item
 */
const mapItem = ({
  id,
  count,
  description,
  short_description: shortDescription,
  excerpt,
  links,
  name,
  slug,
  parent,
  thumbnail
}) => ({
  id,
  count,
  description,
  shortDescription,
  excerpt,
  links,
  name,
  slug,
  parent,
  thumbnailId: thumbnail && thumbnail.id ? thumbnail.id : -1
});

/**
 * Function called after fetching a category
 * @param {function} dispatch The dispatch function
 * @param {Response} response The fetch response
 * @param {Array} items The received item array
 * @returns {void}
 */
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
 * @param {string} language The language string
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @returns {function}
 */
export const fetchProductCategory = createFetchSingleItemThunk(
  fetchItemAction,
  (id, language) => `${language}/wp-json/wp/v2/product_cat/${id}`,
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
 * @param {string} language The language string
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @returns {function} The redux thunk
 */
const fetchAllProductCategories = createFetchAllItemsThunk(
  fetchItemsAction,
  (page, perPage, language) =>
    `${language}/wp-json/wp/v2/product_cat?page=${page}&per_page=${perPage}`,
  mapItem,
  afterCategoryFetch
);

/**
 * Checks whether all product categories should be fetched
 * @returns {boolean} Whether to fetch all product categories
 */
const shouldFetchAllProductCategories = () => (dispatch, state) =>
  (getProductCategories(state).length === 0 ||
    Date.now() - getProductCategoriesLastFetched(state) > 1000 * 60 * 60 * 4) &&
  !isFetchingProductCategories(state);

/**
 * Fetches all items if needed
 * @param {number} perPage How many items should be fetched per page
 * @param {string} language The language string
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @returns {function} The redux thunk
 */
export const fetchAllProductCategoriesIfNeeded = (
  perPage,
  language,
  visualize
) => (dispatch, getState) => {
  const state = getState();
  return shouldFetchAllProductCategories()(dispatch, state)
    ? fetchAllProductCategories(perPage, language, visualize)(dispatch, state)
    : Promise.resolve();
};

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
 * @param {string} language The language string
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {array} itemIds The item ids to fetch
 * @return {function} The redux thunk
 */
/*const fetchProductCategories = createFetchAllItemsThunk(
  fetchItemPageAction,
  (page, perPage, language, itemIds = []) =>
    `${language}/wp-json/wp/v2/product_cat?page=${page}&per_page=${perPage}${
      itemIds.length > 0 ? `&include[]=${itemIds.join("&include[]=")}` : ""
    }`,
  mapItem,
  afterCategoryFetch
);
*/
