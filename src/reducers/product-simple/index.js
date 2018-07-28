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
  })
});

export {
  getAllItems as getSimpleProducts,
  getItemById as getSimpleProductBySku
} from "utilities/reducer";
