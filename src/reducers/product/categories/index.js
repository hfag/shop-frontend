import { combineReducers } from "redux";
import { createReducer } from "utilities/reducer";

const itemName = "productCategory";

export default createReducer(itemName);
export {
	getAllItems as getProductCategories,
	getItemById as getProductCategoryById
} from "utilities/reducer";

/**
 * Returns all categories
 * @param {object} state The exercise category state
 * @param {number} parentId An optional parent category id
 * @return {array} An array of all exercise categories
 */
export const getProductCategoryChildrenIds = (state, parentId = 0) =>
	state.allIds
		.map(id => state.byId[id])
		.filter(category => category.parent === parentId)
		.map(category => category.id);
