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
 * Tracks the user authentication event
 * @param {number} id The user id
 * @param {string} role The user role
 * @returns {Object} The redux action
 */
const trackAuthentication = (id, role) => ({
  type: "TRACK_AUTHENTICATION",
  payload: {
    user: {
      id,
      role
    }
  }
});

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
    .then(({ json: { success, account, code } }) => {
      if (success) {
        dispatch(loginAction(false, null, visualize, mapUser(account), true));

        trackAuthentication(account.id || "-1", account.role || "no-role");

        return Promise.resolve();
      } else {
        dispatch(loginAction(false, code, visualize, null, false));

        return Promise.reject(code);
      }
    })
    .catch(e => {
      dispatch(loginAction(false, e, visualize, null, false));

      return Promise.reject(e);
    });
};

/**
 * Logs a user in
 * @param {string} username The username/email
 * @returns {Promise} The fetch promise
 */
export const resetPassword = username => dispatch => {
  const formData = new FormData();
  formData.append("user_login", username);

  return fetchApi(
    `/wp-login.php?action=lostpassword`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
      headers: new Headers()
    },
    false
  ).then(response => {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
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
    .then(({ json: { success, code } }) => {
      if (success) {
        dispatch(registrationAction(false, null, visualize));

        return Promise.resolve();
      } else {
        dispatch(registrationAction(false, code, visualize));

        return Promise.reject(code);
      }
    })
    .catch(e => {
      dispatch(registrationAction(false, e, visualize));

      return Promise.reject(e);
    });
};
