import { fetchApi } from "utilities/api";
import { createFetchAction } from "utilities/action";

/**
 * Action called before and after fetching the JWT token
 * @param {boolean} isFetching Whether the token is currently being fetched
 * @param {string} error If there was an error during the request, this field should contain it
 * @param {object} token The received token
 * @returns {object} The redux action
 */
const fetchJwtToken = createFetchAction("FETCH_JWT_TOKEN", "token");

/**
 * Verifies the jwt token
 * @returns {object} The redux action
 */
const verifyJwtToken = createFetchAction("VERIFY_JWT_TOKEN", "verified");

/**
 * Logs the user out and resets the jwt token
 * @returns {object} The redux action
 */
export const resetJwtToken = () => ({
	type: "RESET_JWT_TOKEN"
});

/**
 * Logs a user in using a jwt token
 * @param {string} username The user's username
 * @param {string} password The user's password
 * @returns {function} A redux thunk
 */
export const login = (username, password) => dispatch => {
	dispatch(fetchJwtToken(true, null));

	const form = new FormData();
	form.append("username", username);
	form.append("password", password);

	return fetch("/wp-json/jwt-auth/v1/token", {
		method: "POST",
		body: form
	})
		.then(
			response =>
				response.ok
					? response.json()
					: Promise.reject(new Error("Response wasn't ok!"))
		)
		.then(token => {
			dispatch(fetchJwtToken(false, null, token));
		})
		.catch(error => {
			dispatch(fetchJwtToken(false, error, {}));

			return Promise.reject(error);
		});
};

/**
 * Validates the authentication token
 * @return {function} The redux thunk
 */
export const verifyToken = () => dispatch => {
	dispatch(verifyJwtToken(true, null, null));

	return fetch("/wp-json/jwt-auth/v1/token/validate", {
		method: "POST"
	})
		.then(response => response.json())
		.then(token => {
			dispatch(verifyJwtToken(false, null, true));
		})
		.catch(error => {
			dispatch(fetchJwtToken(false, error, false));
			dispatch(resetJwtToken(false, error, false));

			return Promise.reject(error);
		});
};
