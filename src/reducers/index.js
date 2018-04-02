import { combineReducers } from "redux";
import { reducer as burgerMenu } from "redux-burger-menu";

import { wrap } from "utilities/reducer";

/*
#     #    #    #     # 
##    #   # #   #     # 
# #   #  #   #  #     # 
#  #  # #     # #     # 
#   # # #######  #   #  
#    ## #     #   # #   
#     # #     #    # 
*/

/**
 * Checks whether the burger menu is open
 * @param {object} state This state
 * @return {boolean} Whether the burger menu is open
 */
export const getBurgerMenuOpen = state => state.burgerMenu.isOpen;

/*
   #    #     # ####### #     # 
  # #   #     #    #    #     # 
 #   #  #     #    #    #     # 
#     # #     #    #    ####### 
####### #     #    #    #     # 
#     # #     #    #    #     # 
#     #  #####     #    #     # 
*/
import authentication, * as fromAuthentication from "./authentication";

/**
 * Checks whether the user is logged in
 * @param {object} state This state
 * @return {boolean} Whether the user is logged in
 */
export const getLoggedIn = wrap(
	fromAuthentication.getLoggedIn,
	state => state.authentication
);
/**
 * Returns the authentication token
 * @param {object} state This state
 * @return {object} The woocommerce credentials
 */
export const getCredentials = wrap(
	fromAuthentication.getCredentials,
	state => state.authentication
);

/**
 * Returns the authentication token
 * @param {object} state This state
 * @return {object} The jwt token
 */
export const getAuthenticationToken = wrap(
	fromAuthentication.getAuthenticationToken,
	state => state.authentication
);

/**
 * Checks whether the token is currently being fetched
 * @param {object} state This state
 * @return {boolean} Whether the token is being fetched
 */
export const getAuthenticationTokenFetching = wrap(
	fromAuthentication.getAuthenticationTokenFetching,
	state => state.authentication
);
/**
 * Returns the error of the jwt token
 * @param {object} state This state
 * @return {error} The current error
 */
export const getAuthenticationTokenError = wrap(
	fromAuthentication.getAuthenticationTokenError,
	state => state.authentication
);

/*
 #####  #######    #    ######   #####  #     # 
#     # #         # #   #     # #     # #     # 
#       #        #   #  #     # #       #     # 
 #####  #####   #     # ######  #       ####### 
      # #       ####### #   #   #       #     # 
#     # #       #     # #    #  #     # #     # 
 #####  ####### #     # #     #  #####  #     #
 */

import productSearch, * as fromProductSearch from "./product-search";

/**
 * Returns the product list
 * @param {object} state This state
 * @return {array} The product array
 */
export const getProductSearchSections = wrap(
	fromProductSearch.getProductSearchSections,
	state => state.productSearch
);
/**
 * Checks whether it is currently being fetched
 * @param {object} state This state
 * @return {boolean} Whether the token is being fetched
 */
export const getProductSearchFetching = wrap(
	fromProductSearch.getProductSearchFetching,
	state => state.productSearch
);
/**
 * Returns the error
 * @param {object} state This state
 * @return {error} The current error
 */
export const getProductSearchError = wrap(
	fromProductSearch.getProductSearchError,
	state => state.productSearch
);

/*
######  ######  ####### ######  #     #  #####  ####### 
#     # #     # #     # #     # #     # #     #    #    
#     # #     # #     # #     # #     # #          #    
######  ######  #     # #     # #     # #          #    
#       #   #   #     # #     # #     # #          #    
#       #    #  #     # #     # #     # #     #    #    
#       #     # ####### ######   #####   #####     # 
*/

import product, * as fromProduct from "./product";

/**
 * Returns the product with the specified id
 * @param {object} state This state
 * @param {number} categoryId The product id
 * @return {array} All product categories
 */
export const getProductById = wrap(
	fromProduct.getProductById,
	state => state.product
);

/**
 * Returns all products
 * @param {object} state This state
 * @return {array} All products
 */
export const getProducts = wrap(
	fromProduct.getProducts,
	state => state.product
);

/**
 * Returns the product category with the specified id
 * @param {object} state This state
 * @param {number} categoryId The category id
 * @return {array} All product categories
 */
export const getProductCategoryById = wrap(
	fromProduct.getProductCategoryById,
	state => state.product
);

/**
 * Returns all product categories
 * @param {object} state This state
 * @return {array} All product categories
 */
export const getProductCategories = wrap(
	fromProduct.getProductCategories,
	state => state.product
);

/**
 * Returns the children ids of the category with the specified id
 * @param {object} state This state
 * @param {number} categoryId An optional parent category id
 * @return {array} All product categories
 */
export const getProductCategoryChildrenIds = wrap(
	fromProduct.getProductCategoryChildrenIds,
	state => state.product
);

/**
 * Returns the product attribute with the specified id
 * @param {object} state This state
 * @param {number} categoryId An optional parent category id
 * @return {array} The specified product attribute
 */
export const getProductAttributeById = wrap(
	fromProduct.getProductAttributeById,
	state => state.product
);

/**
 * Returns all product attributes
 * @param {object} state This state
 * @return {array} All product attributes
 */
export const getProductAttributes = wrap(
	fromProduct.getProductAttributes,
	state => state.product
);

/**
 * Returns a slug => attribute map
 * @param {object} state The redux state
 */
export const getProductAttributesBySlug = wrap(
	fromProduct.getProductAttributesBySlug,
	state => state.product
);

/*
   #    ####### #######    #     #####  #     # #     # ####### #     # ####### 
  # #      #       #      # #   #     # #     # ##   ## #       ##    #    #    
 #   #     #       #     #   #  #       #     # # # # # #       # #   #    #    
#     #    #       #    #     # #       ####### #  #  # #####   #  #  #    #    
#######    #       #    ####### #       #     # #     # #       #   # #    #    
#     #    #       #    #     # #     # #     # #     # #       #    ##    #    
#     #    #       #    #     #  #####  #     # #     # ####### #     #    #
*/

import attachment, * as fromAttachment from "./attachment";

/**
 * Returns all attachments
 * @param {object} state This state
 * @return {array} All attachments
 */
export const getAttachments = wrap(
	fromAttachment.getAttachments,
	state => state.attachment
);

/**
 * Retrieves the object with the specified id
 * @param {object} state This state
 * @param {number} id The object id
 * @return {object} The requested object
 */
export const getAttachmentById = wrap(
	fromAttachment.getAttachmentById,
	state => state.attachment
);

import { loadingBarReducer as loadingBar } from "react-redux-loading-bar";
import { routerReducer as router } from "react-router-redux";

export default combineReducers({
	router,
	loadingBar,
	burgerMenu,
	productSearch,
	authentication,
	product,
	attachment
});
