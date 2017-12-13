/**
 * Managing the status
 * @param {object} state The redux state
 * @param {object} action The dispatched action
 * @return {object} The new state
 */
const status = (state = { isFetching: false, status: null }, action) => {
	switch (action.type) {
		case "FETCH_PRODUCT_CATEGORIES":
			return {
				isFetching: action.isFetching,
				status:
					action.status || action.status === null ? action.status : state.status
			};
		default:
			return state;
	}
};

export default status;
