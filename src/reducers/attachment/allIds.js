/**
 * Holding all ids
 * @param {object} state The redux state
 * @param {object} action The dispatched action
 * @return {object} The new state
 */
const allIds = (state = [], action) => {
	switch (action.type) {
		case "FETCH_ATTACHMENT":
			return action.attachmentId
				? !action.isFetching && action.attachment && !action.status
					? state.includes(action.attachmentId)
						? state
						: [...state, action.attachmentId]
					: state.filter(attachment => attachment.id !== action.attachmentId)
				: [];
		default:
			return state;
	}
};

export default allIds;
