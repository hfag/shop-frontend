import { fetchApi } from "../utilities/api";
import { createFetchAction } from "../utilities/action";

/**
 * Maps an order object
 * @param {Object} order The order
 * @returns {Object} The mapped order
 */
const mapOrder = ({
  id,
  title,
  billing,
  shipping,
  items,
  comment,
  total,
  status,
  created
}) => ({
  id,
  title,
  billing,
  shipping,
  items: items.map(({ id, variationId, name, sku, quantity, attributes }) => ({
    id,
    variationId,
    name,
    sku,
    quantity,
    attributes: Object.values(attributes).reduce((object, attribute) => {
      object[attribute.display_key] = attribute.display_value;
      return object;
    }, {})
  })),
  comment,
  total,
  status,
  created
});

/**
 * Fetches orders
 * @param {boolean} isFetching Whether the the login is in progress
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {Object} orders The user's orders
 * @returns {object} The redux action
 */
const fetchOrdersAction = createFetchAction("FETCH_ORDERS", "orders");

/**
 * Fetches a user's orders
 * @param {string} language The language string
 * @param {boolean} visualize Whether to visualize the progress of this action
 * @returns {Promise} The fetch promise
 */
export const fetchOrders = (language, visualize = false) => dispatch => {
  dispatch(fetchOrdersAction(true, null, visualize));
  return fetchApi(`${language}/wp-json/hfag/user-orders`, {
    method: "GET",
    credentials: "include"
  })
    .then(({ json: { orders } }) => {
      dispatch(fetchOrdersAction(false, null, visualize, orders.map(mapOrder)));

      return Promise.resolve();
    })
    .catch(e => {
      dispatch(fetchOrdersAction(false, e, visualize, null));

      return Promise.reject(e);
    });
};
