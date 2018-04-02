import { combineReducers } from "redux";
import { createReducer } from "utilities/reducer";

const itemName = "productAttribute";

export default createReducer(itemName);
export {
	getAllItems as getProductAttributes,
	getItemById as getProductAttributeById
} from "utilities/reducer";

/**
 * Returns a slug => attribute map
 * @param {object} state The redux state
 */
export const getProductAttributesBySlug = state =>
	state.allIds.reduce((object, id) => {
		object[state.byId[id].slug] = state.byId[id];
		return object;
	}, {});
