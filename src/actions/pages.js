import {
  createFetchSingleItemAction,
  createFetchSingleItemThunk,
  createFetchItemsAction,
  createFetchAllItemsThunk,
  createFetchItemPageThunk
} from "utilities/action";

import { fetchApi } from "../utilities/api";
import { fetchAttachmentAction } from "./attachments";
import { getPageBySlug } from "../reducers";

const itemName = "page";

/**
 * Maps an item so we can store it in the state
 * @param {Object} item The item to map
 * @returns {Object} The mapped item
 */
export const mapItem = ({
  id,
  slug,
  title: { rendered: title },
  content: { rendered: content }
}) => ({
  id,
  slug,
  title,
  content,
  description: ""
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
export const fetchPageAction = createFetchSingleItemAction(itemName);

/**
 * Fetches a page by it's slug
 * @param {number} pageSlug The slug of the page
 * @param {boolean} visualize Whether to visualize the progress
 * @returns {function} The redux thunk
 */
const fetchPage = (pageSlug, visualize = true) => dispatch => {
  dispatch(fetchPageAction(true, null, visualize, pageSlug));

  return fetchApi(`/wp-json/wp/v2/pages?slug=${pageSlug}`, {
    method: "GET"
  })
    .then(({ json: items }) => {
      if (items.length > 0) {
        dispatch(
          fetchPageAction(false, null, visualize, pageSlug, mapItem(items[0]))
        );

        return Promise.resolve({ item: items[0] });
      } else {
        dispatch(
          fetchPageAction(
            false,
            new Error("No page was found"),
            visualize,
            pageSlug
          )
        );
      }
    })
    .catch(err => {
      dispatch(fetchPageAction(true, err, visualize, pageSlug));
    });
};

/**
 * Checks whether the page should be fetched
 * @param {string} slug The product slug
 * @param {string} state The redux state
 * @returns {boolean} Whether the product should be fetched
 */
const shouldFetchPage = (slug, state) => {
  const page = getPageBySlug(state, slug);
  return !page || Date.now() - page._lastFetched > 1000 * 60 * 60 * 4;
};

/**
 * Fetches a page if needed
 * @param {string} slug The page slug
 * @param {boolean} visualize Whether to visualize the progress
 * @returns {Promise} The fetch promise
 */
export const fetchPageIfNeeded = (slug, visualize) => (dispatch, getState) =>
  shouldFetchPage(slug, getState())
    ? fetchPage(slug, visualize)(dispatch, getState)
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
export const fetchPagesAction = createFetchItemsAction(itemName, "itemIds");

/**
 * Fetches the specified items
 * @param {number} page The first page to fetch
 * @param {number} pageTo The last page to fetch, -1 for all
 * @param {number} perPage How many items should be fetched per page
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {array} itemIds Only the specified product ids will be fetched
 * @return {function}
 */
export const fetchPages = createFetchItemPageThunk(
  fetchPagesAction,
  (
    page,
    perPage,
    itemIds = [],
    categoryIds = [],
    order = "desc",
    orderby = "date"
  ) =>
    `/wp-json/wp/v2/pages?page=${page}&per_page=${perPage}${
      itemIds.length > 0 ? "&include[]=" + itemIds.join("&include[]=") : ""
    }`,
  mapItem
);
