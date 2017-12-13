/**
 * Holding all ids
 * @param {object} state The redux state
 * @param {object} action The dispatched action
 * @return {object} The new state
 */
const allIds = (state = [], action) => {
	switch (action.type) {
		case "FETCH_PRODUCT_CATEGORIES":
			return action.categories
				? action.categories.map(category => category.id)
				: state;
		default:
			return state;
	}
};

export default allIds;
