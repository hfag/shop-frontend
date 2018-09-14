import {
  fetchAttachmentsAction,
  mapItem as mapAttachment,
  fetchAttachments
} from "../attachments";
import { fetchAttributesAction, mapItem as mapAttribute } from "./attributes";
import {
  createFetchSingleItemAction,
  createFetchSingleItemThunk,
  createFetchItemsAction,
  createFetchAllItemsThunk,
  createFetchItemPageThunk,
  createFetchItemPageAction,
  createFetchItemsThunk
} from "../../utilities/action";
import { getProductBySlug } from "../../reducers";

const itemName = "product";

/**
 * Maps the received object properties to the ones that should be stored in the state
 * @param {Object} data The item to map
 * @param {number} index The item index
 * @returns {Object} The mapped item
 */
export const mapItem = (data, index) => {
  const {
    id,
    slug,
    sku,
    title: { rendered: title },
    content: { rendered: content },
    minPrice,
    description,
    featured_media: thumbnailId,
    product_cat: categoryIds,
    date,
    discount = { bulk_discount: {} },
    fields = [],
    galleryImageIds = [],
    crossSellIds = []
  } = data.product ? data.product : data;

  return {
    id,
    slug,
    sku,
    title,
    content,
    minPrice,
    description,
    thumbnailId,
    categoryIds,
    date,
    order: index,
    discount: {
      bulk: discount.bulk_discount
    },
    fields: fields.map(
      ({ label, type, placeholder, max_length: maxLength }) => ({
        label,
        type,
        placeholder,
        maxLength
      })
    ),
    galleryImageIds,
    crossSellIds
  };
};

/**
 * Maps an item so we can store it in the state
 * @param {Object} item The item to map
 * @returns {Object} The mapped item
 */
const mapVariation = ({
  attributes,
  dimensions,
  weight,
  image_id: imageId,
  display_price: price,
  is_in_stock: isInStock,
  is_purchasable: isPurchasable,
  is_sold_individually: isSoldIndividually,
  is_virtual: isVirtual,
  max_qty: maxQty,
  min_qty: minQty,
  sku,
  variation_description: description,
  variation_id: id
}) => ({
  id: parseInt(id),
  description,
  sku,
  price,
  imageId: parseInt(imageId),
  dimensions,
  weight: parseFloat(weight),
  minQty: parseInt(minQty),
  maxQty: parseInt(maxQty),
  isInStock,
  isPurchasable,
  isSoldIndividually,
  isVirtual,
  attributes: Object.keys(attributes).reduce((object, attributeKey) => {
    if (attributeKey.startsWith("attribute_")) {
      object[attributeKey.replace("attribute_", "")] = attributes[attributeKey];
    } else {
      object[attributeKey] = attributes[attributeKey];
    }

    return object;
  }, {})
});

/**
 * Action called before and after fetching an item
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {object} item The received item
 * @return {object} The redux action
 */
const fetchItemAction = createFetchSingleItemAction(itemName);

/**
 * Fetches a single item
 * @param {number} slug The slug of the requested item
 * @param {boolean} visualize Whether to visualize the progress
 * @returns {function}
 */
const fetchProduct = createFetchSingleItemThunk(
  fetchItemAction,
  slug => `/wp-json/hfag/product?productSlug=${slug}`,
  mapItem,
  (dispatch, response, item) => {
    const promises = [];
    if (item.variations && item.product && item.product.id) {
      dispatch(
        fetchVariationsAction(
          false,
          null,
          false,
          item.variations.map(mapVariation),
          item.product.slug
        )
      );

      dispatch(
        fetchAttachmentsAction(
          false,
          null,
          false,
          item.variations
            .map(variation => variation.image)
            .filter(t => t)
            .map(mapAttachment)
        )
      );

      promises.push(
        dispatch(
          fetchAttachments(1, -1, 100, true, [
            item.product.featured_media,
            ...item.product.galleryImageIds
          ])
        )
      );
    }

    if (item.product.crossSellIds && item.product.crossSellIds.length > 0) {
      promises.push(
        dispatch(fetchProducts(1, -1, 20, true, item.product.crossSellIds))
      );
    }

    if (item.attributes) {
      dispatch(
        fetchAttributesAction(
          false,
          null,
          false,
          item.attributes.map(mapAttribute)
        )
      );
    }

    return Promise.all(promises);
  }
);

/**
 * Checks whether the product should be fetched
 * @param {string} slug The product slug
 * @param {string} state The redux state
 * @returns {boolean} Whether the product should be fetched
 */
const shouldFetchProduct = (slug, state) => {
  const product = getProductBySlug(state, slug);
  const listProduct = !product || !product.sku;
  const invalidProduct =
      !product ||
      !product._lastFetched ||
      Date.now() - product.lastFetched > 1000 * 60 * 60 * 4,
    isFetchingProduct = !product || product._isFetching;

  return (invalidProduct && !isFetchingProduct) || listProduct;
};

/**
 * Fetches a product if needed
 * @param {string} slug The product slug
 * @param {boolean} visualize Whether to visualize the progress
 * @returns {Promise} The fetch product
 */
export const fetchProductIfNeeded = (slug, visualize) => (
  dispatch,
  getState
) => {
  const state = getState(),
    shouldFetch = shouldFetchProduct(slug, state);
  return shouldFetch
    ? fetchProduct(slug, visualize)(dispatch, state)
    : Promise.resolve();
};

/**
 * Action called before and after fetching an item page
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {object} items The received items
 * @return {object} The redux action
 */
const fetchItemPageAction = createFetchItemPageAction(itemName);

/**
 * Fetches all items
 * @param {number} perPage How many items should be fetched per page
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @return {function}
 */
export const fetchAllProducts = createFetchAllItemsThunk(
  fetchItemPageAction,
  (page, perPage) => `/wp-json/wp/v2/product?page=${page}&per_page=${perPage}`,
  mapItem
);

/**
 * Action called before and after fetching all items
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {object} items The received items
 * @param {array} itemIds If specified only items with the specified item ids will be fetched
 * @param {array} categoryIds If specified only items of the given categories will be fetched
 * @param {string} order Whether the items should be order asc or desc
 * @param {string} orderby What the items should by ordered by
 * @return {object} The redux action
 */
export const fetchItemsAction = createFetchItemsAction(
  itemName,
  "itemIds",
  "categoryIds",
  "order",
  "orderby"
);

/**
 * Fetches the specified items
 * @param {number} page The first page to fetch
 * @param {number} pageTo The last page to fetch, -1 for all
 * @param {number} perPage How many items should be fetched per page
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {array} itemIds Only the specified product ids will be fetched
 * @param {array} categoryIds If specified only items of the given categories will be fetched
 * @param {string} order Whether the items should be order asc or desc
 * @param {string} orderby What the items should by ordered by
 * @return {function}
 */
export const fetchProducts = createFetchItemPageThunk(
  fetchItemsAction,
  (
    page,
    perPage,
    itemIds = [],
    categoryIds = [],
    order = "asc",
    orderby = "menu_order"
  ) =>
    `/wp-json/wp/v2/product?page=${page}&per_page=${perPage}${
      itemIds.length > 0 ? "&include[]=" + itemIds.join("&include[]=") : ""
    }${
      categoryIds.length > 0
        ? "&product_cat[]=" + categoryIds.join("&product_cat[]=")
        : ""
    }&orderby=${orderby}&order=${order}&_embed`,
  mapItem,
  (dispatch, response, items) => {
    dispatch(
      fetchAttachmentsAction(
        false,
        null,
        false,
        items
          .map(product => product._embedded["wp:featuredmedia"][0])
          .filter(t => t)
          .map(mapAttachment)
      )
    );
  }
);

/**
 * Action called before and after fetching all items
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {object} items The received items
 * @param {array} productSlug The product slug these variations are related to
 * @return {object} The redux action
 */
const fetchVariationsAction = createFetchItemsAction(
  "product_variation",
  "productSlug"
);

/**
 * Fetches all product variations for one product
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {array} productSlug The product slug these variations are related to
 * @return {function}
 */
export const fetchVariations = createFetchItemsThunk(
  fetchVariationsAction,
  productSlug => `/wp-json/hfag/product-variations?productSlug=${productSlug}`,
  mapVariation,
  (dispatch, items) => {
    dispatch(
      fetchAttachmentsAction(
        false,
        null,
        false,
        items
          .map(variation => variation.image)
          .filter(t => t)
          .map(mapAttachment)
      )
    );
  }
);
