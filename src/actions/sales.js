import { fetchApi } from "../utilities/api";
import { createFetchAction } from "../utilities/action";
import {
  mapItem as mapProduct,
  fetchItemsAction as fetchProductsAction
} from "./product";

/**
 * Maps a sale object
 * @param {Object} sale The sale object
 * @returns {Object} The mapped sale object
 */
export const mapSale = ({
  productId,
  variationId,
  price,
  salePrice,
  saleEnd
}) => ({
  productId,
  variationId,
  price,
  salePrice,
  saleEnd
});
/**
 * Fetches all sales
 * @param {boolean} isFetching Whether the the login is in progress
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {Object} sales What products are on sale
 * @returns {object} The redux action
 */
const fetchSalesAction = createFetchAction("FETCH_SALES", "sales");

/**
 * Fetches all sales
 * @param {boolean} visualize Whether to visualize the progress of this action
 * @returns {Promise} The fetch promise
 */
export const fetchSales = (visualize = false) => dispatch => {
  dispatch(fetchSalesAction(true, null, visualize, [], []));

  return fetchApi(`/wp-json/hfag/sales`, {
    method: "GET",
    credentials: "include"
  })
    .then(({ json: { sales, products } }) => {
      dispatch(fetchSalesAction(false, null, visualize, sales.map(mapSale)));

      dispatch(
        fetchProductsAction(
          false,
          null,
          false,
          products.map(mapProduct),
          [],
          [],
          "",
          ""
        )
      );

      return Promise.resolve({ sales, products });
    })
    .catch(e => {
      dispatch(fetchSalesAction(false, e, visualize, [], []));

      return Promise.reject(e);
    });
};
