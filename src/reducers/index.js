import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { reducer as burgerMenu } from "redux-burger-menu";

//import reducers
import authentication, * as fromAuthentication from "./authentication";

import product, * as fromProduct from "./product";
import attachment, * as fromAttachment from "./attachment";
import productSearch, * as fromProductSearch from "./product-search";

export default combineReducers({
	routing: routerReducer,
	burgerMenu,
	productSearch,
	authentication,
	product,
	attachment
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

/**
 * Returns all product categories
 * @param {object} state The redux state
 * @return {array} An array of product categories
 */
export const getProductCategories = state =>
	fromProduct.getProductCategories(state.product);

/**
 * Returns all attachments
 * @param {object} state The redux state
 * @return {array} All attachments
 */
export const getAttachments = state =>
	fromAttachment.getAttachments(state.attachment);

/**
 * Retrieves the object with the specified id
 * @param {object} state The redux state
 * @param {number} id The object id
 * @return {object} The requested object
 */
export const getAttachment = (state, id) =>
	fromAttachment.getAttachment(state.attachment, id);

/**
 * Returns all items by id
 * @param {object} state The redux state
 * @return {object} An object mapping the id to the object
 */
export const getAttachmentsById = state =>
	fromAttachment.getAttachmentsById(state.attachment);
