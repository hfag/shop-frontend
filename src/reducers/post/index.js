import { combineReducers } from "redux";
import { createReducer } from "utilities/reducer";

const itemName = "post";

export default createReducer(itemName, "slug");
export {
  getAllItems as getPosts,
  getItemById as getPostBySlug,
  getLastFetched as getPostsLastFetched,
  isFetching as isFetchingPosts
} from "../../utilities/reducer";
