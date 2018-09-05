import { combineReducers } from "redux";
import { createReducer } from "utilities/reducer";

const itemName = "productCategory";

export default createReducer(itemName, "slug");
export {
  getAllItems as getProductCategories,
  getItemById as getProductCategoryBySlug,
  getLastFetched as getProductCategoriesLastFetched,
  isFetching as isFetchingProductCategories
} from "utilities/reducer";

/**
 * Returns the category
 * @param {Object} state The exercise category state
 * @param {number} categoryId The category id to look for
 * @returns {Array} An array of all exercise categories
 */
export const getProductCategoryById = (state, categoryId) =>
  state.allIds
    .map(slug => state.byId[slug])
    .find(category => category.id === categoryId);

/**
 * Returns all categories
 * @param {Object} state The exercise category state
 * @param {number} parentId An optional parent category id
 * @returns {Array} An array of all exercise categories
 */
export const getProductCategoryChildrenIdsById = (state, parentId = 0) =>
  state.allIds
    .map(id => state.byId[id])
    .filter(category => category.parent === parentId)
    .map(category => category.id);
