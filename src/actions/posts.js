import {
  createFetchSingleItemAction,
  createFetchSingleItemThunk,
  createFetchItemsAction,
  createFetchAllItemsThunk,
  createFetchItemPageThunk
} from "utilities/action";

import { fetchApi } from "../utilities/api";
import { fetchAttachmentAction } from "./attachments";

const itemName = "post";

/**
 * Maps an item so we can store it in the state
 * @param {Object} item The item to map
 * @returns {Object} The mapped item
 */
export const mapItem = ({
  id,
  slug,
  title: { rendered: title },
  content: { rendered: content },
  featured_media: thumbnailId
}) => ({
  id,
  slug,
  title,
  content,
  description: "",
  thumbnailId
});

/**
 * Action called before and after fetching an item
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {object} itemId The request item id
 * @param {object} item The received item
 * @returns {object} The redux action
 */
export const fetchPostAction = createFetchSingleItemAction(itemName);

/**
 * Fetches a post by it's slug
 * @param {number} postSlug The slug of the post
 * @param {boolean} visualize Whether to visualize the progress
 * @returns {function} The redux thunk
 */
export const fetchPostBySlug = (postSlug, visualize = true) => dispatch => {
  dispatch(fetchPostAction(true, null, visualize, postSlug));

  return fetchApi(`/wp-json/wp/v2/posts?slug=${postSlug}&_embed`, {
    method: "GET"
  })
    .then(({ json: items }) => {
      if (items.length > 0) {
        dispatch(
          fetchAttachmentAction(
            false,
            null,
            false,
            items[0]._embedded["wp:featuredmedia"][0].id,
            items[0]._embedded["wp:featuredmedia"][0]
          )
        );
        dispatch(
          fetchPostAction(false, null, visualize, postSlug, mapItem(items[0]))
        );
      } else {
        dispatch(
          fetchPostAction(
            false,
            new Error("No post was found"),
            visualize,
            postSlug
          )
        );
      }
    })
    .catch(err => {
      dispatch(fetchItem(true, err, visualize, postSlug));
    });
};

/**
 * Action called before and after fetching all items
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {object} items The received items
 * @param {array} itemIds If specified only items with the specified item ids will be fetched
 * @param {string} order Whether the items should be order asc or desc
 * @param {string} orderby What the items should by ordered by
 * @return {object} The redux action
 */
export const fetchPostsAction = createFetchItemsAction(itemName, "itemIds");

/**
 * Fetches the specified items
 * @param {number} page The first page to fetch
 * @param {number} pageTo The last page to fetch, -1 for all
 * @param {number} perPage How many items should be fetched per page
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {array} itemIds Only the specified product ids will be fetched
 * @return {function}
 */
export const fetchPosts = createFetchItemPageThunk(
  fetchPostsAction,
  (
    page,
    perPage,
    itemIds = [],
    categoryIds = [],
    order = "desc",
    orderby = "date"
  ) =>
    `/wp-json/wp/v2/post?page=${page}&per_page=${perPage}${
      itemIds.length > 0 ? "&include[]=" + itemIds.join("&include[]=") : ""
    }`,
  mapItem
);
