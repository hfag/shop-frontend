import {
  createFetchAction,
  createFetchSingleItemAction,
  createFetchSingleItemThunk,
  createFetchItemsAction,
  createFetchItemsThunk,
  createFetchItemPageAction
} from "utilities/action";

const itemName = "productAttribute";

/**
 * Maps an item so we can store it in the state
 * @param {Object} item The item to map
 * @returns {Object} The mapped item
 */
export const mapItem = ({
  id,
  name,
  slug,
  options,
  position,
  is_taxonomy: isTaxonomy,
  is_variation: isVariation
}) => ({
  id,
  name,
  slug,
  options,
  position,
  isTaxonomy,
  isVariation
});

/**
 * Action called before and after fetching multiple items
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {object} items The received items
 * @param {number} productSlug The product slug
 * @return {object} The redux action
 */
export const fetchAttributesAction = createFetchItemsAction(
  itemName,
  "productSlug"
);

/**
 * Fetches a single item
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {number} productSlug The product slug
 * @returns {function}
 */
export const fetchProductAttributes = createFetchItemsThunk(
  fetchAttributesAction,
  slug => `/wp-json/hfag/product-attributes?productSlug=${slug}`,
  mapItem
);
