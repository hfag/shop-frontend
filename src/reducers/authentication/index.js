import { combineReducers } from "redux";
import { wrap } from "utilities/reducer";

//import reducers
import jwtToken, * as fromAuthToken from "./authentication-token";
import woocommerceCredentials, * as fromWcCredentials from "./authentication-woocommerce";

export default combineReducers({
	token: jwtToken,
	credentials: woocommerceCredentials
});

/**
 * Checks whether the user is logged in
 * @param {object} state This state
 * @return {boolean} Whether the user is logged in
 */
export const getLoggedIn = wrap(
	fromWcCredentials.getLoggedIn,
	state => state.credentials
);
/**
 * Returns the authentication token
 * @param {object} state This state
 * @return {object} The woocommerce credentials
 */
export const getCredentials = wrap(
	fromWcCredentials.getCredentials,
	state => state.credentials
);

/**
 * Returns the authentication token
 * @param {object} state This state
 * @return {object} The jwt token
 */
export const getAuthenticationToken = wrap(
	fromAuthToken.getAuthenticationToken,
	state => state.token
);
/**
 * Checks whether the token is currently being fetched
 * @param {object} state This state
 * @return {boolean} Whether the token is being fetched
 */
export const getAuthenticationTokenFetching = wrap(
	fromAuthToken.getAuthenticationTokenFetching,
	state => state.token
);
/**
 * Returns the error of the jwt token
 * @param {object} state This state
 * @return {error} The current error
 */
export const getAuthenticationTokenError = wrap(
	fromAuthToken.getAuthenticationTokenError,
	state => state.token
);
