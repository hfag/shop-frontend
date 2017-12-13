import { combineReducers } from "redux";

import allIds from "./allIds";
import byId from "./byId";

export default combineReducers({
	allIds,
	byId
});

/**
 * Returns all attachments
 * @param {object} attachment The attachment part of the redux state
 * @return {array} All attachments
 */
export const getAttachments = attachment =>
	attachment.allIds.map(id => attachment.byId[id]);
