import { combineReducers } from "redux";

import {
  createById,
  createAllIds,
  createIsFetching,
  createLastFetched
} from "../../utilities/reducer";

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
  isFetching: createIsFetching(itemName, "sku"),
  lastFetched: createLastFetched(itemName, "sku")
});

export {
  getAllItems as getSimpleProducts,
  getItemById as getSimpleProductBySku,
  getLastFetched as getSimpleProductsLastFetched,
  isFetching as isFetchingSimpleProducts
} from "utilities/reducer";
