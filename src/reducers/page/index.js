import { combineReducers } from "redux";
import { createReducer } from "utilities/reducer";

const itemName = "page";

export default createReducer(itemName, "slug");
export {
  getAllItems as getPages,
  getItemById as getPageBySlug
} from "utilities/reducer";
