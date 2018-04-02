import categories, * as fromCategories from "./categories";
import attributes, * as fromAttributes from "./attributes";

import { combineReducers } from "redux";
import { wrap, createAllIds, createById } from "utilities/reducer";

const itemName = "product";

export {
	getAllItems as getProducts,
	getItemById as getProductById
} from "utilities/reducer";

export default combineReducers({
	byId: createById(itemName, "id", (state, action) => {
		switch (action.type) {
			case "FETCH_PRODUCT_VARIATIONS":
				return !action.isFetching && !action.error && action.productId
					? {
							...state,
							[action.productId]: {
								...state[action.productId],
								variations: action.items
							}
					  }
					: state;
			default:
				return state;
		}
	}),
	allIds: createAllIds(itemName),
	categories,
	attributes
});

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
export const getProductCategoryChildrenIds = wrap(
	fromCategories.getProductCategoryChildrenIds,
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
