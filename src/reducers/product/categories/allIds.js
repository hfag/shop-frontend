/**
 * Holding all ids
 * @param {object} state The redux state
 * @param {object} action The dispatched action
 * @return {object} The new state
 */
const allIds = (state = [], action) => {
	switch (action.type) {
		case "FETCH_PRODUCT_CATEGORIES":
			console.log("state", state);
			console.log("cat", action.categories);
			return action.categories
				? [
						...state,
						...action.categories
							.filter(category => !state.includes(category.id))
							.map(category => category.id)
					]
				: state;
		default:
			return state;
	}
};

export default allIds;
