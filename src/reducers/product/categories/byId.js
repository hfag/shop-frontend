/**
 * Managing the exercise categories by id
 * @param {object} state The redux state
 * @param {object} action The dispatched action
 * @return {object} The new state
 */
const byId = (state = {}, action) => {
	switch (action.type) {
		case "FETCH_PRODUCT_CATEGORIES":
			return action.categories
				? {
						...state,
						...action.categories.reduce((obj, category) => {
							obj[category.id] = category;
							return obj;
						}, {})
					}
				: state;
		default:
			return state;
	}
};

export default byId;
