import { combineReducers } from "redux";

import { createReducer } from "../../../utilities/reducer";

const itemName = "productAttribute";

export default createReducer(itemName);
export {
  getAllItems as getProductAttributes,
  getItemById as getProductAttributeById,
  isFetching as isFetchingProductAttributes,
  getLastFetched as getProductAttributesLastFetched
} from "utilities/reducer";

/**
 * Returns a slug => attribute map
 * @param {Object} state The redux state
 * @returns {Object} The object mapping the slugs
 */
export const getProductAttributesBySlug = state =>
  state.allIds.reduce((object, id) => {
    object[state.byId[id].slug] = state.byId[id];
    return object;
  }, {});
