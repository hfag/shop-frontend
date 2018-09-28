import { fetchApi } from "../utilities/api";
import { createFetchAction } from "../utilities/action";

/**
 * Maps a user object
 * @param {Object} user The user object
 * @returns {Object} The mapped user
 */
export const mapUser = ({
  first_name: firstName,
  last_name: lastName,
  email,
  role,
  billing,
  shipping,
  created,
  discount
}) => ({
  firstName,
  lastName,
  email,
  role,
  billing,
  shipping,
  created,
  discount: Object.keys(discount).reduce((object, key) => {
    object[parseInt(key)] = parseInt(discount[key]);
    return object;
  }, {})
});
/**
 * Updates a user's account details
 * @param {boolean} isFetching Whether the the login is in progress
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {Object} account The user's account
 * @returns {object} The redux action
 */
const updateAccountAction = createFetchAction("UPDATE_ACCOUNT", "account");

/**
 * Updates the user's account
 * @param {string} firstName The user's first name
 * @param {string} lastName The user's last name
 * @param {string} email The user's email
 * @param {string} password The user's password
 * @param {string} newPassword The user's new password
 * @param {boolean} visualize Whether to visualize the progress of this action
 * @returns {Promise} The fetch promise
 */
export const updateAccount = (
  firstName,
  lastName,
  email,
  password,
  newPassword,
  visualize = false
) => dispatch => {
  dispatch(
    updateAccountAction(true, null, visualize, {
      firstName,
      lastName,
      email,
      password,
      newPassword
    })
  );
  return fetchApi(`/wp-json/hfag/user-account`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify({ firstName, lastName, email, password, newPassword })
  })
    .then(({ json: { account } }) => {
      dispatch(
        updateAccountAction(false, null, visualize, mapUser(account), true)
      );

      return Promise.resolve(account);
    })
    .catch(e => {
      dispatch(updateAccountAction(false, e, visualize, null, false));

      return Promise.reject(e);
    });
};

/**
 * Fetches the user's account
 * @param {boolean} isFetching Whether the the login is in progress
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {Object} account The user's account
 * @returns {object} The redux action
 */
const fetchAccountAction = createFetchAction("FETCH_USER_ACCOUNT", "account");

/**
 * Fetches the user's account
 * @param {boolean} visualize Whether to visualize the progress of this action
 * @returns {Promise} The fetch promise
 */
export const fetchAccount = (visualize = false) => dispatch => {
  dispatch(fetchAccountAction(true, null, visualize));
  return fetchApi(`/wp-json/hfag/user-account`, {
    method: "GET",
    credentials: "include"
  })
    .then(({ json: { account } }) => {
      dispatch(fetchAccountAction(false, null, visualize, mapUser(account)));

      return Promise.resolve();
    })
    .catch(e => {
      dispatch(fetchAccountAction(false, e, visualize, null));

      return Promise.reject(e);
    });
};

/**
 * Updates a user's address
 * @param {boolean} isFetching Whether the the login is in progress
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {Object} account The user's account
 * @returns {object} The redux action
 */
const updateAddressAction = createFetchAction("UPDATE_USER_ADDRESS", "account");

/**
 * Logs a user in
 * @param {string} address The user's address
 * @param {string} type The adress type
 * @param {boolean} visualize Whether to visualize the progress of this action
 * @returns {Promise} The fetch promise
 */
export const updateAddress = (address, type, visualize = false) => dispatch => {
  dispatch(updateAddressAction(true, null, visualize));
  return fetchApi(`/wp-json/hfag/user-address`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify({ address, type })
  })
    .then(({ json: { account } }) => {
      dispatch(updateAddressAction(false, null, visualize, mapUser(account)));

      return Promise.resolve();
    })
    .catch(e => {
      dispatch(updateAddressAction(false, e, visualize, null));

      return Promise.reject(e);
    });
};
