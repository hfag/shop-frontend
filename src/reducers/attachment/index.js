import { combineReducers } from "redux";

import allIds from "./allIds";
import byId from "./byId";

export default combineReducers({
	allIds,
	byId
});

/**
 * Retrieves the object with the specified id
 * @param {object} attachment This part of the redux state
 * @param {number} id The object id
 * @return {object} The requested object
 */
export const getAttachment = (attachment, id) => attachment.byId[id];

/**
 * Returns all items by id
 * @param {object} attachment This part of the redux state
 * @return {object} An object mapping the id to the object
 */
export const getAttachmentsById = attachment => attachment.byId;

/**
 * Returns all items
 * @param {object} attachment This part of the redux state
 * @return {array} All items
 */
export const getAttachments = attachment =>
	attachment.allIds.map(id => attachment.byId[id]);
