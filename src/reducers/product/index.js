import categories, * as fromCategories from "./categories";
import { combineReducers } from "redux";

export default combineReducers({ categories });

/**
 * Returns all product categories
 * @param {object} product This state
 * @return {array} All product categories
 */
export const getProductCategories = product =>
	fromCategories.getProductCategories(product.categories);
