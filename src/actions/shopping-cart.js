import { Promise } from "es6-promise";

import { fetchApi } from "../utilities/api";
import { createFetchAction } from "../utilities/action";

/**
 * Fetches the shopping cart
 * @param {boolean} isFetching Whether the cart is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {object} cart The received shopping cart
 * @returns {object} The redux action
 */
const fetchShoppingCartAction = createFetchAction(
  "FETCH_SHOPPING_CART",
  "cart"
);

/**
 * Fetches the shopping cart
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @returns {function} The redux thunk
 */
export const fetchShoppingCart = (visualize = false) => dispatch => {
  dispatch(fetchShoppingCartAction(true, null, visualize));
  return fetchApi(`/wp-json/hfag/shopping-cart`, {
    method: "GET",
    credentials: "include"
  })
    .then(({ json: cart }) => {
      dispatch(fetchShoppingCartAction(false, null, visualize, cart));

      return Promise.resolve(cart);
    })
    .catch(e => {
      dispatch(fetchShoppingCartAction(false, e, visualize));

      return Promise.reject(e);
    });
};

/**
 * Adds an item to the shopping cart
 * @param {boolean} isFetching Whether the cart is currently being updated
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {object} cart The received shopping cart
 * @returns {object} The redux action
 */
const addShoppingCartItemAction = createFetchAction(
  "ADD_SHOPPING_CART_ITEM",
  "cart"
);

/**
 * Adds an item to the shopping cart
 * @param {number|string} productId The product id that should be added
 * @param {number|string} [variationId] The variation id
 * @param {Object} [variation] The variation attributes
 * @param {number} [quantity=1] The quantity
 * @param {boolean} [visualize=false] Whether the progress of this action should be visualized
 * @returns {function} The redux thunk
 */
export const addShoppingCartItem = (
  productId,
  variationId,
  variation,
  quantity = 1,
  visualize = false
) => dispatch => {
  dispatch(addShoppingCartItemAction(true, null, visualize));

  return fetchApi("/wp-json/hfag/shopping-cart", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      product_id: productId,
      variation_id: variationId,
      variation,
      quantity
    })
  })
    .then(({ json: cart }) => {
      if (cart.error) {
        return Promise.reject(new Error("Unknown error while adding"));
      }

      dispatch(addShoppingCartItemAction(false, null, visualize, cart));

      return Promise.resolve(cart);
    })
    .catch(e => {
      dispatch(addShoppingCartItemAction(false, e, visualize));

      return Promise.reject(e);
    });
};

/**
 * Adds an item to the shopping cart
 * @param {boolean} isFetching Whether the cart is currently being updated
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {object} cart The received shopping cart
 * @returns {object} The redux action
 */
const updateShoppingCartItemAction = createFetchAction(
  "UPDATE_SHOPPING_CART",
  "cart"
);

/**
 * Updates the shopping cart
 * @param {Array<Object>} items All items that should be in the shopping cart
 * @param {boolean} [visualize=false] Whether the progress of this action should be visualized
 * @returns {function} The redux thunk
 */
export const updateShoppingCartItem = (
  items,
  visualize = false
) => dispatch => {
  dispatch(updateShoppingCartItemAction(true, null, visualize));

  return fetchApi("/wp-json/hfag/shopping-cart", {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify({
      items
    })
  })
    .then(({ json: cart }) => {
      if (cart.error) {
        return Promise.reject(new Error("Unknown error while adding"));
      }

      dispatch(updateShoppingCartItemAction(false, null, visualize, cart));

      return Promise.resolve(cart);
    })
    .catch(e => {
      dispatch(updateShoppingCartItemAction(false, e, visualize));

      return Promise.reject(e);
    });
};
