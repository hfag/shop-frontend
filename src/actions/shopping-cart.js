import { fetchApi } from "../utilities/api";
import { createFetchAction } from "../utilities/action";
import { getShoppingCartLastFetched } from "../reducers";
import {
  trackAddingCartItem,
  trackClearingCart,
  addCartItem,
  trackCartUpdate,
  clearCart
} from "../utilities/analytics";

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
 * @param {string} language The language string
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @returns {function} The redux thunk
 */
export const fetchShoppingCart = (language, visualize = false) => dispatch => {
  dispatch(fetchShoppingCartAction(true, null, visualize));
  return fetchApi(`${language}/wp-json/hfag/shopping-cart`, {
    method: "GET",
    credentials: "include"
  })
    .then(({ json: cart }) => {
      dispatch(fetchShoppingCartAction(false, null, visualize, cart));

      clearCart();

      for (const item of cart.items) {
        addCartItem(item.sku, item.title, undefined, item.price, item.quantity);
      }

      try {
        trackCartUpdate(cart.total);
      } catch (e) {
        console.error(e);
      }

      return Promise.resolve(cart);
    })
    .catch(e => {
      dispatch(fetchShoppingCartAction(false, e, visualize));
      return Promise.reject(e);
    });
};
/**
 * Checks whether the shopping cart should be fetched
 * @param {Object} state The redux state
 * @returns {boolean} Whether the shopping cart shoud be fecthed
 */
const shouldFetchShoppingCart = state => {
  return Date.now() - getShoppingCartLastFetched(state) > 1000 * 60 * 60 * 4;
};
/**
 * Fetches the shopping cart if needed
 * @param {string} language The language string
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @returns {function} The redux thunk
 */
export const fetchShoppingCartIfNeeded = (language, visualize = false) => (
  dispatch,
  getState
) => {
  const state = getState();
  return shouldFetchShoppingCart(state)
    ? fetchShoppingCart(language, visualize)(dispatch)
    : Promise.resolve();
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
 * @param {Object} analytics The analytics data
 * @param {string} language The language string
 * @param {boolean} [visualize=false] Whether the progress of this action should be visualized
 *
 * @returns {function} The redux thunk
 */
export const addShoppingCartItem = (
  productId,
  variationId,
  variation,
  quantity = 1,
  { sku, productName, minPrice },
  language,
  visualize = false
) => dispatch => {
  dispatch(addShoppingCartItemAction(true, null, visualize));

  return fetchApi(`${language}/wp-json/hfag/shopping-cart`, {
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

      try {
        trackAddingCartItem(
          sku,
          productName,
          undefined,
          minPrice,
          quantity,
          cart.total
        );
      } catch (e) {
        console.error(e);
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
 * Updates the shopping cart
 * @param {boolean} isFetching Whether the cart is currently being updated
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {object} cart The received shopping cart
 * @returns {object} The redux action
 */
const updateShoppingCartAction = createFetchAction(
  "UPDATE_SHOPPING_CART",
  "cart"
);

/**
 * Updates the shopping cart
 * @param {Array<Object>} items All items that should be in the shopping cart
 * @param {Array<Object>} oldItems The previous shopping cart items
 * @param {string} language The language string
 * @param {boolean} [visualize=false] Whether the progress of this action should be visualized
 * @returns {function} The redux thunk
 */
export const updateShoppingCart = (
  items,
  oldItems,
  language,
  visualize = false
) => dispatch => {
  dispatch(updateShoppingCartAction(true, null, visualize));

  return fetchApi(`${language}/wp-json/hfag/shopping-cart`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify({
      items
    })
  })
    .then(({ json: cart }) => {
      if (cart.error) {
        return Promise.reject(new Error("Unknown error while updating cart"));
      }

      clearCart();

      for (const item of cart.items) {
        addCartItem(item.sku, item.title, undefined, item.price, item.quantity);
      }

      try {
        trackCartUpdate(cart.total);
      } catch (e) {
        console.error(e);
      }

      dispatch(updateShoppingCartAction(false, null, visualize, cart));

      return Promise.resolve(cart);
    })
    .catch(e => {
      dispatch(updateShoppingCartAction(false, e, visualize));

      return Promise.reject(e);
    });
};

/**
 * Submits an order
 * @param {boolean} isFetching Whether the order is being submitted
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {Object} shippingAddress The shipping address
 * @param {Object} billingAddress The billing address
 * @param {Object} comments Order comments
 * @param {Object} success Success
 * @returns {Object} The redux action
 */
const submitOrderAction = createFetchAction(
  "SUBMIT_ORDER",
  "shippingAddress",
  "billingAddress",
  "comments",
  "success"
);

/**
 * Submits an order
 * @param {Object} shippingAddress The shipping address
 * @param {Object} billingAddress All billing address
 * @param {string} comments Optional order comment
 * @param {string} language The language string
 * @param {boolean} [visualize=false] Whether the progress of this action should be visualized
 * @returns {Promise} The redux thunk
 */
export const submitOrder = (
  shippingAddress,
  billingAddress,
  comments = "",
  language,
  visualize = false
) => dispatch => {
  dispatch(
    submitOrderAction(
      true,
      null,
      visualize,
      shippingAddress,
      billingAddress,
      comments,
      null
    )
  );

  return fetchApi(`${language}/wp-json/hfag/submit-order`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      billingAddress,
      shippingAddress,
      comments
    })
  })
    .then(({ json: order }) => {
      if (order.errors && order.errors.length > 0) {
        return Promise.reject(new Error("Unknown error while adding"));
      }

      dispatch(
        submitOrderAction(
          false,
          null,
          visualize,
          shippingAddress,
          billingAddress,
          comments,
          true
        )
      );

      return Promise.resolve(order.data);
    })
    .catch(e => {
      dispatch(
        submitOrderAction(
          false,
          e,
          visualize,
          shippingAddress,
          billingAddress,
          comments,
          false
        )
      );

      return Promise.reject(e);
    });
};

/**
 * The shopping cart clearing action
 * @returns {Object} The redux action
 */
const clearShoppingCartAction = () => ({ type: "CLEAR_SHOPPING_CART" });

/**
 * Clears the shopping cart
 * @returns {function} The redux thunk
 */
export const clearShoppingCart = () => dispatch => {
  try {
    trackClearingCart();
  } catch (e) {
    console.error(e);
  }
  dispatch(clearShoppingCartAction());
};
