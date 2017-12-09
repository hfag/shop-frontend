import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { reducer as burgerMenu } from "redux-burger-menu";

//import reducers
import authentication, * as fromAuthentication from "./authentication";

import productSearch, * as fromProductSearch from "./product-search";

export default combineReducers({
	routing: routerReducer,
	burgerMenu,
	productSearch,
	authentication
});

/**
 * Checks whether the burger menu is open
 * @param {object} state The redux state
 * @return {boolean} Whether the burger menu is open
 */
export const getBurgerMenuOpen = state => state.burgerMenu.isOpen;

/**
 * Checks whether the user is logged in
 * @param {object} state The redux state
 * @return {boolean} Whether the user is logged in
 */
export const getLoggedIn = state =>
	fromAuthentication.getLoggedIn(state.authentication);
/**
 * Returns the authentication token
 * @param {object} authentication This part of the redux state
 * @return {object} The woocommerce credentials
 */
export const getCredentials = state =>
	fromAuthentication.getCredentials(state.authentication);

/**
 * Returns the authentication token
 * @param {object} state The redux state
 * @return {object} The jwt token
 */
export const getAuthenticationToken = state =>
	fromAuthentication.getAuthenticationToken(state.authentication);
/**
 * Checks whether the token is currently being fetched
 * @param {object} state The redux state
 * @return {boolean} Whether the token is being fetched
 */
export const getAuthenticationTokenFetching = state =>
	fromAuthentication.getAuthenticationTokenFetching(state.authentication);
/**
 * Returns the status of the jwt token
 * @param {object} state The redux state
 * @return {error} The current status
 */
export const getAuthenticationTokenStatus = state =>
	fromAuthentication.getAuthenticationTokenStatus(state.authentication);

/**
 * Returns the product list
 * @param {object} state The redux state
 * @return {array} The product array
 */
export const getProductSearchSections = state =>
	fromProductSearch.getProductSearchSections(state.productSearch);
/**
 * Checks whether it is currently being fetched
 * @param {object} state The redux state
 * @return {boolean} Whether the token is being fetched
 */
export const getProductSearchFetching = state =>
	fromProductSearch.getProductSearchFetching(state.productSearch);
/**
 * Returns the status
 * @param {object} state The redux state
 * @return {error} The current status
 */
export const getProductSearchStatus = state =>
	fromProductSearch.getProductSearchStatus(state.productSearch);
