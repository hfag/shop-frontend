import { connectRouter } from "connected-react-router";

/**
 * Creates a router reducer
 * @param {Object} history The history object
 * @returns {function} The reducer
 */
export const createRouterReducer = history => connectRouter(history);
