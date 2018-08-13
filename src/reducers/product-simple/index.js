import { combineReducers } from "redux";

import { createById, createAllIds } from "../../utilities/reducer";

const itemName = "simple_product";

export default combineReducers({
  byId: createById(itemName, "sku", (state, action) => {
    switch (action.type) {
      case "CLEAR_SIMPLE_PRODUCTS":
        return {};
      default:
        return state;
    }
  }),
  allIds: createAllIds(itemName, "sku", (state, action) => {
    switch (action.type) {
      case "CLEAR_SIMPLE_PRODUCTS":
        return [];
      default:
        return state;
    }
  }),
  isFetching: (state = false, action) => {
    switch (action.type) {
      case "FETCH_SIMPLE_PRODUCTS":
        return action.isFetching;
      default:
        return state;
    }
  }
});

export {
  getAllItems as getSimpleProducts,
  getItemById as getSimpleProductBySku
} from "utilities/reducer";

/**
 * Checks if simple products are being fetched
 * @param {Object} state The redux state
 * @returns {boolean} Whether the simple items are being fetched
 */
export const isFetchingSimpleItems = state => state.isFetching;
