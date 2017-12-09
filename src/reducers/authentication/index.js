import { combineReducers } from "redux";

//import reducers
import jwtToken, * as fromAuthToken from "./authentication-token";
import woocommerceCredentials, * as fromWcCredentials from "./authentication-woocommerce";

export default combineReducers({
	token: jwtToken,
	credentials: woocommerceCredentials
});

/**
 * Checks whether the user is logged in
 * @param {object} authentication This part of the redux state
 * @return {boolean} Whether the user is logged in
 */
export const getLoggedIn = authentication =>
	fromWcCredentials.getLoggedIn(authentication.credentials);
/**
 * Returns the authentication token
 * @param {object} authentication This part of the redux state
 * @return {object} The woocommerce credentials
 */
export const getCredentials = authentication =>
	fromWcCredentials.getCredentials(authentication.credentials);

/**
 * Returns the authentication token
 * @param {object} authentication This part of the redux state
 * @return {object} The jwt token
 */
export const getAuthenticationToken = authentication =>
	fromAuthToken.getAuthenticationToken(authentication.token);
/**
 * Checks whether the token is currently being fetched
 * @param {object} authentication This part of the redux state
 * @return {boolean} Whether the token is being fetched
 */
export const getAuthenticationTokenFetching = authentication =>
	fromAuthToken.getAuthenticationTokenFetching(authentication.token);
/**
 * Returns the status of the jwt token
 * @param {object} authentication This part of the redux state
 * @return {error} The current status
 */
export const getAuthenticationTokenStatus = authentication =>
	fromAuthToken.getAuthenticationTokenStatus(authentication.token);
