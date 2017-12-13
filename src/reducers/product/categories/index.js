import { combineReducers } from "redux";

import allIds from "./allIds";
import byId from "./byId";
import status from "./status";

export default combineReducers({
	allIds,
	byId,
	status
});

/**
 * Attaches the correct children to a category
 * @param {object} category The category to which the children should be attached
 * @param {object} children The parent id / children map
 */
const attachChildren = (category, children) => ({
	...category,
	children:
		category.id in children
			? children[category.id].map(child => attachChildren(child, children))
			: []
});

/**
 * Returns all categories
 * @param {object} state The exercise category state
 * @return {array} An array of all exercise categories
 */
export const getProductCategories = state => {
	const children = {};
	const categories = state.allIds.map(id => state.byId[id]).filter(category => {
		if (category.parent && category.parent > 0) {
			if (!(category.parent in children)) {
				children[category.parent] = [];
			}

			children[category.parent].push(category);
			return false;
		}
		return true;
	});

	//attach children
	return categories.map(category => attachChildren(category, children));
};
