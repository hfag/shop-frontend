import {
  createFetchSingleItemAction,
  createFetchItemsAction,
  createFetchItemPageThunk
} from "utilities/action";

import { fetchApi } from "../utilities/api";
import {
  fetchAttachmentAction,
  mapItem as mapAttachment,
  fetchAttachmentsAction
} from "./attachments";
import {
  getPostBySlug,
  getStickyPosts,
  isFetchingPosts,
  getPosts,
  getPostsLastFetched
} from "../reducers";
import {
  createFetchAllItemsThunk,
  createFetchItemPageAction
} from "../utilities/action";

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
  description,
  featured_media: thumbnailId
}) => ({
  id,
  slug,
  title,
  description,
  content,
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
 * @param {string} language The language fetch string
 * @param {boolean} visualize Whether to visualize the progress
 * @returns {function} The redux thunk
 */
const fetchPost = (postSlug, language, visualize = true) => dispatch => {
  dispatch(fetchPostAction(true, null, visualize, postSlug));

  return fetchApi(`${language}/wp-json/wp/v2/posts?slug=${postSlug}&_embed`, {
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
            mapAttachment(items[0]._embedded["wp:featuredmedia"][0])
          )
        );
        dispatch(
          fetchPostAction(false, null, visualize, postSlug, mapItem(items[0]))
        );

        return Promise.resolve({ item: items[0] });
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
      dispatch(fetchPostAction(true, err, visualize, postSlug));
    });
};

/**
 * Checks whether the post should be fetched
 * @param {string} slug The product slug
 * @param {string} state The redux state
 * @returns {boolean} Whether the product should be fetched
 */
const shouldFetchPost = (slug, state) => {
  const post = getPostBySlug(state, slug);
  return !post || Date.now() - post._lastFetched > 1000 * 60 * 60 * 4;
};

/**
 * Fetches a product if needed
 * @param {string} slug The product slug
 * @param {string} language The language fetch string
 * @param {boolean} visualize Whether to visualize the progress
 * @returns {Promise} The fetch product
 */
export const fetchPostIfNeeded = (slug, language, visualize) => (
  dispatch,
  getState
) =>
  shouldFetchPost(slug, getState())
    ? fetchPost(slug, language, visualize)(dispatch, getState)
    : Promise.resolve();

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
 * @param {string} language The language string
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {array} itemIds Only the specified product ids will be fetched
 * @return {function}
 */
export const fetchPosts = createFetchItemPageThunk(
  fetchPostsAction,
  (
    page,
    perPage,
    language,
    itemIds = [],
    categoryIds = [],
    order = "desc",
    orderby = "date"
  ) =>
    `${language}/wp-json/wp/v2/posts?page=${page}&per_page=${perPage}${
      itemIds.length > 0 ? "&include[]=" + itemIds.join("&include[]=") : ""
    }`,
  mapItem
);

const fetchPostPageAction = createFetchItemPageAction(itemName);

/**
 * Fetches all items
 * @param {number} perPage How many items should be fetched per page
 * @param {string} language The language string
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @returns {function} The redux thunk
 */
const fetchAllPosts = createFetchAllItemsThunk(
  fetchPostPageAction,
  (page, perPage, language) =>
    `${language}/wp-json/wp/v2/posts?page=${page}&per_page=${perPage}&_embed`,
  mapItem,
  (dispatch, response, items) => {
    dispatch(
      fetchAttachmentsAction(
        false,
        null,
        false,
        items
          .filter(
            post =>
              post._embedded &&
              post._embedded["wp:featuredmedia"] &&
              post._embedded["wp:featuredmedia"].length > 0
          )
          .map(post => post._embedded["wp:featuredmedia"][0])
          .filter(t => t)
          .map(mapAttachment)
      )
    );
  }
);

/**
 * Checks whether all product categories should be fetched
 * @returns {boolean} Whether to fetch all product categories
 */
const shouldFetchAllPosts = () => (dispatch, state) =>
  (getPosts(state).length - getStickyPosts(state).length < 0 ||
    Date.now() - getPostsLastFetched(state) > 1000 * 60 * 60 * 4) &&
  !isFetchingPosts(state);

/**
 * Fetches all items if needed
 * @param {number} perPage How many items should be fetched per page
 * @param {string} language The language string
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @returns {function} The redux thunk
 */
export const fetchAllPostsIfNeeded = (perPage, language, visualize) => (
  dispatch,
  getState
) => {
  const state = getState();
  return shouldFetchAllPosts()(dispatch, state)
    ? fetchAllPosts(perPage, language, visualize)(dispatch, state)
    : Promise.resolve();
};
