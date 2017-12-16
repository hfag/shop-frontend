import { combineReducers } from "redux";
import { createReducer } from "utilities/reducer";

const itemName = "attachment";

export default createReducer(itemName);
export {
	getAllItems as getProductCategories,
	getItemById as getProductCategoryById
} from "utilities/reducer";

export {
	getAllItems as getAttachments,
	getItemById as getAttachmentById
} from "utilities/reducer";
