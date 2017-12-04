import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { reducer as burgerMenu } from "redux-burger-menu";

//import reducers
import authenticationToken, * as fromAuthToken from "./authentication-token";
import productSearch, * as fromProductSearch from "./product-search";

export default combineReducers({
	routing: routerReducer,
	burgerMenu,
	authenticationToken,
	productSearch
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
	fromAuthToken.getLoggedIn(state.authenticationToken);
/**
 * Returns the authentication token
 * @param {object} state The redux state
 * @return {object} The jwt token
 */
export const getAuthenticationToken = state =>
	fromAuthToken.getAuthenticationToken(state.authenticationToken);
/**
 * Checks whether the token is currently being fetched
 * @param {object} state The redux state
 * @return {boolean} Whether the token is being fetched
 */
export const getAuthenticationTokenFetching = state =>
	fromAuthToken.getAuthenticationTokenFetching(state.authenticationToken);
authenticationToken.isFetching;
/**
 * Returns the status of the jwt token
 * @param {object} state The redux state
 * @return {error} The current status
 */
export const getAuthenticationTokenStatus = state =>
	fromAuthToken.getAuthenticationTokenStatus(state.authenticationToken);

/**
 * Returns the product list
 * @param {object} state The redux state
 * @return {array} The product array
 */
export const getProductSearchProducts = state =>
	fromProductSearch.getProductSearchProducts(state.productSearch);
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
