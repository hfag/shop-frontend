import categories, * as fromCategories from "./categories";
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
	categories
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
