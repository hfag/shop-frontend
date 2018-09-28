import { combineReducers } from "redux";

import {
  wrap,
  createAllIds,
  createById,
  createIsFetching,
  createLastFetched
} from "../../utilities/reducer";
import categories, * as fromCategories from "./categories";
import attributes, * as fromAttributes from "./attributes";

const itemName = "product";

export {
  getAllItems as getProducts,
  getItemById as getProductBySlug
} from "../../utilities/reducer";

export default combineReducers({
  byId: createById(itemName, "slug", (state, action) => {
    switch (action.type) {
      case "FETCH_PRODUCT_VARIATIONS":
        return !action.isFetching && !action.error && action.productSlug
          ? {
              ...state,
              [action.productSlug]: {
                ...state[action.productSlug],
                variations: action.items
              }
            }
          : state;
      default:
        return state;
    }
  }),
  allIds: createAllIds(itemName, "slug"),
  isFetching: createIsFetching(itemName, "slug"),
  lastFetched: createLastFetched(itemName, "slug"),
  categories,
  attributes
});

/**
 * Returns the product with the specified id
 * @param {Object} state This state
 * @param {number} productId The product id
 * @returns {Object} The product
 */
export const getProductById = (state, productId) =>
  state.allIds
    .map(slug => state.byId[slug])
    .find(product => product.id === productId);

/**
 * Returns the product category with the specified id
 * @param {object} state This state
 * @param {number} categoryId An optional parent category id
 * @return {array} All product categories
 */
export const getProductCategoryById = wrap(
  fromCategories.getProductCategoryById,
  state => state.categories
);
/**
 * Returns the product category with the specified slug
 * @param {object} state This state
 * @param {number} categorySlug An optional parent category slug
 * @return {array} All product categories
 */
export const getProductCategoryBySlug = wrap(
  fromCategories.getProductCategoryBySlug,
  state => state.categories
);
/**
 * Returns all product categories
 * @param {object} state This state
 * @return {array} All product categories
 */
export const getProductCategories = wrap(
  fromCategories.getProductCategories,
  state => state.categories
);
/**
 * Returns the children of the category with the specified id
 * @param {object} state This state
 * @param {number} categoryId An optional parent category id
 * @return {array} All product categories
 */
export const getProductCategoryChildrenIdsById = wrap(
  fromCategories.getProductCategoryChildrenIdsById,
  state => state.categories
);
/**
 * Returns whether multiple product categories are being fetched
 * @param {object} state This state
 * @return {boolean} Whether product categories are being fetched
 */
export const isFetchingProductCategories = wrap(
  fromCategories.isFetchingProductCategories,
  state => state.categories
);
/**
 * Returns all product categories
 * @param {object} state This state
 * @return {array} All product categories
 */
export const getProductCategoriesLastFetched = wrap(
  fromCategories.getProductCategoriesLastFetched,
  state => state.categories
);

/**
 * Returns the product attribute with the specified id
 * @param {object} state This state
 * @param {number} categoryId An optional parent category id
 * @return {array} The specified product attribute
 */
export const getProductAttributeById = wrap(
  fromAttributes.getProductAttributeById,
  state => state.attributes
);
/**
 * Returns all product attributes
 * @param {object} state This state
 * @return {array} All product attributes
 */
export const getProductAttributes = wrap(
  fromAttributes.getProductAttributes,
  state => state.attributes
);
/**
 * Returns a slug => attribute map
 * @param {object} state The redux state
 */
export const getProductAttributesBySlug = wrap(
  fromAttributes.getProductAttributesBySlug,
  state => state.attributes
);
