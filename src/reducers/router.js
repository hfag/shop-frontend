import { connectRouter } from "connected-react-router";

import { isClient } from "../utilities/ssr";

/**
 * Creates a router reducer
 * @param {Object} history The history object
 * @returns {function} The reducer
 */
export const createRouterReducer = history =>
  isClient
    ? connectRouter(history)
    : () => ({ location: history.location, action: "POP" });
