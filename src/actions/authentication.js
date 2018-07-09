import { fetchApi } from "../utilities/api";
import { createFetchAction } from "../utilities/action";
import { mapUser } from "./user";

/**
 * Logs a user in
 * @param {boolean} isFetching Whether the the login is in progress
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @param {Object} account The user account
 * @param {boolean} success Whether the login was successful
 * @returns {object} The redux action
 */
const loginAction = createFetchAction("LOGIN_USER", "account", "success");

/**
 * Logs a user in
 * @param {string} username The username/email
 * @param {string} password The user's password
 * @param {boolean} visualize Whether to visualize the progress of this action
 * @returns {Promise} The fetch promise
 */
export const login = (username, password, visualize = false) => dispatch => {
  dispatch(loginAction(true, null, visualize));
  return fetchApi(`/wp-json/hfag/login`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ username, password })
  })
    .then(({ json: { account } }) => {
      dispatch(loginAction(false, null, visualize, mapUser(account), true));

      return Promise.resolve();
    })
    .catch(e => {
      dispatch(loginAction(false, e, visualize, null, false));

      return Promise.reject(e);
    });
};

/**
 * Logs a user out
 * @returns {Object} The redux action
 */
export const logout = () => ({
  type: "LOGOUT_USER"
});

/**
 * Registers a user
 * @param {boolean} isFetching Whether the the registration is in progress
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {boolean} visualize Whether the progress of this action should be visualized
 * @returns {object} The redux action
 */
const registrationAction = createFetchAction("REGISTER_USER");

/**
 * Logs a user in
 * @param {string} username The username/email
 * @param {string} password The user's password
 * @param {boolean} visualize Whether to visualize the progress of this action
 * @returns {Promise} The fetch promise
 */
export const register = (username, password, visualize = false) => dispatch => {
  dispatch(registrationAction(true, null, visualize));
  return fetchApi(`/wp-json/hfag/register`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ username, password })
  })
    .then(({ json }) => {
      dispatch(registrationAction(false, null, visualize));

      return Promise.resolve();
    })
    .catch(e => {
      dispatch(registrationAction(false, e, visualize));

      return Promise.reject(e);
    });
};
