/**
 * Managing the exercise categories by id
 * @param {object} state The redux state
 * @param {object} action The dispatched action
 * @return {object} The new state
 */
const byId = (state = {}, action) => {
	switch (action.type) {
		case "FETCH_ATTACHMENT":
			return {
				...state,
				[action.attachmentId]: {
					...action.attachment,
					isFetching: action.isFetching,
					status: action.status
				}
			};
		case "FETCH_ATTACHMENTS":
			return action.isFetching || action.status
				? state
				: action.attachments.reduce((object, attachment) => {
						object[attachment.id] = {
							...attachment,
							isFetching: action.isFetching,
							status: action.status
						};
						return object;
					}, {});
		default:
			return state;
	}
};

export default byId;
