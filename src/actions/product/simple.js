import { fetchApi } from "../../utilities/api";
import { createFetchItemsAction } from "../../utilities/action";

/**
 * Maps a simple product
 * @returns {Object} The mapped object
 */
const mapSimpleProduct = ({
  slug,
  variationId,
  sku,
  name,
  discount: { bulk },
  price,
  meta
}) => ({
  slug,
  variationId,
  sku,
  name,
  discount: { bulk },
  price: parseFloat(price),
  meta
});

/**
 * Action called before and after fetching all items
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {object} items The received items
 * @return {object} The redux action
 */
const fetchSimpleProductAction = createFetchItemsAction("simple_product");

/**
 * Fetches all product variations for one product
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @returns {function} A redux thunk
 */
export const fetchSimpleProducts = (visualize = false) => dispatch => {
  dispatch(fetchSimpleProductAction(true, null, visualize));
  return fetchApi(`/wp-json/hfag/products-simple`, {
    method: "GET",
    credentials: "include"
  })
    .then(({ json: { products } }) => {
      dispatch(
        fetchSimpleProductAction(
          false,
          null,
          visualize,
          products.map(mapSimpleProduct)
        )
      );

      return Promise.resolve();
    })
    .catch(e => {
      dispatch(fetchSimpleProductAction(false, e, visualize, null));

      return Promise.reject(e);
    });
};

/**
 * Clears the simple products locally to free up space
 * @returns {Object} The redux action
 */
export const clearSimpleProducts = () => ({ type: "CLEAR_SIMPLE_PRODUCTS" });
