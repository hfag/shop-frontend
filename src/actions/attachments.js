import {
  createFetchSingleItemAction,
  createFetchSingleItemThunk,
  createFetchItemsAction,
  createFetchItemPageThunk
} from "utilities/action";

const itemName = "attachment";

/**
 * Maps an item so we can store it in the state
 * @param {Object} item The item to map
 * @returns {Object} The mapped item
 */
export const mapItem = item => {
  try {
    const {
      id,
      date,
      caption,
      mime_type: mimeType,
      media_details,
      source_url: url,
      caption: { rendered: renderedCaption }
    } = item;

    const { width, height, sizes } = media_details;

    return {
      id,
      date,
      caption: renderedCaption,
      mimeType,
      width,
      height,
      url,
      sizes
    };
  } catch (e) {
    console.error(e);
    console.error("Loading invalid image", item);
    return null;
  }
};

/**
 * Action called before and after fetching an item
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {object} item The received item
 * @returns {object} The redux action
 */
export const fetchAttachmentAction = createFetchSingleItemAction(itemName);

/**
 * Fetches a single item
 * @param {number} itemId The id of the requested item
 * @param {string} language The language string
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @returns {function}
 */
export const fetchAttachment = createFetchSingleItemThunk(
  fetchAttachmentAction,
  (id, language) => `${language}/wp-json/wp/v2/media/${id}`,
  mapItem
);

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
export const fetchAttachmentsAction = createFetchItemsAction(
  itemName,
  "itemIds"
);

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
export const fetchAttachments = createFetchItemPageThunk(
  fetchAttachmentsAction,
  (
    page,
    perPage,
    language,
    itemIds = [],
    categoryIds = [],
    order = "desc",
    orderby = "date"
  ) =>
    `${language}/wp-json/wp/v2/media?page=${page}&per_page=${perPage}${
      itemIds.length > 0 ? "&include[]=" + itemIds.join("&include[]=") : ""
    }`,
  mapItem
);
