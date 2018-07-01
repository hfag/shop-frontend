import { fetchApi } from "../utilities/api";
import { createFetchAction } from "../utilities/action";

/**
 * Fetches all countries and states
 * @param {boolean} isFetching Whether the cart is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {object} countries The received countries
 * @returns {object} The redux action
 */
const fetchCountriesAction = createFetchAction("FETCH_COUNTRIES", "countries");

/**
 * Fetches all countries
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @returns {function} The redux thunk
 */
export const fetchCountries = (visualize = false) => dispatch => {
  dispatch(fetchCountriesAction(true, null, visualize));
  return fetchApi(`/wp-json/hfag/countries`, {
    method: "GET",
    credentials: "include"
  })
    .then(({ json: countries }) => {
      dispatch(fetchCountriesAction(false, null, visualize, countries));

      return Promise.resolve(countries);
    })
    .catch(e => {
      dispatch(fetchCountriesAction(false, e, visualize));

      return Promise.reject(e);
    });
};
