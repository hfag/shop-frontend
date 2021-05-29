import { combineReducers } from "redux";
import { loadingBarReducer as loadingBar } from "react-redux-loading-bar";

import { wrap } from "../utilities/reducer";
import productSearch, * as fromProductSearch from "./product-search";
import product, * as fromProduct from "./product";
import simpleProduct, * as fromSimpleProduct from "./product-simple";
import attachment, * as fromAttachment from "./attachment";
import post, * as fromPost from "./post";
import page, * as fromPage from "./page";
import shoppingCart, * as fromShoppingCart from "./shopping-cart";
import countries, * as fromCountries from "./countries";
import sales, * as fromSales from "./sales";
import account, * as fromAccount from "./account";
import orders, * as fromOrders from "./orders";
import burgerMenu, * as fromBurgerMenu from "./burger-menu";
import { createRouterReducer } from "./router";
import {
  getLanguageFromPathname,
  languageToFetchString
} from "../utilities/i18n";

/**
 * Checks whether the burger menu is open
 * @param {Object} state This state
 * @returns {boolean} Whether the burger menu is open
 */
export const getBurgerMenuOpen = wrap(
  fromBurgerMenu.getBurgerMenuOpen,
  state => state.burgerMenu
);

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
/**
 * Returns the last product search query
 * @param {Object} productSearch This part of the redux state
 * @returns {Error} The last query
 */
export const getLastProductSearchQuery = wrap(
  fromProductSearch.getLastProductSearchQuery,
  state => state.productSearch
);

/**
 * Returns the product with the specified
 * @param {object} state This state
 * @param {number} productId The product id
 * @return {array} All product categories
 */
export const getProductById = wrap(
  fromProduct.getProductById,
  state => state.product
);
/**
 * Returns the product with the specified slug
 * @param {object} state This state
 * @param {number} productSlug The product slug
 * @return {array} All product categories
 */
export const getProductBySlug = wrap(
  fromProduct.getProductBySlug,
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
 * Returns the product with the specified sku
 * @param {object} state This state
 * @param {number} productSku The product sku
 * @return {array} All product categories
 */
export const getSimpleProductBySku = wrap(
  fromSimpleProduct.getSimpleProductBySku,
  state => state.simpleProduct
);

/**
 * Returns all products
 * @param {object} state This state
 * @return {array} All products
 */
export const getSimpleProducts = wrap(
  fromSimpleProduct.getSimpleProducts,
  state => state.simpleProduct
);
/**
 * Returns whether simple products are being fetched
 * @param {object} state This state
 * @return {boolean} Whether simple items are being fetched
 */
export const isFetchingSimpleProducts = wrap(
  fromSimpleProduct.isFetchingSimpleProducts,
  state => state.simpleProduct
);
/**
 * Returns the last time simple products were fetched
 * @param {object} state This state
 * @return {number} The unix timestamp
 */
export const getSimpleProductsLastFetched = wrap(
  fromSimpleProduct.getSimpleProductsLastFetched,
  state => state.simpleProduct
);

/**
 * Returns the product category with the specified slug
 * @param {object} state This state
 * @param {number} categorySlug The category slug
 * @return {array} All product categories
 */
export const getProductCategoryBySlug = wrap(
  fromProduct.getProductCategoryBySlug,
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
export const getProductCategoryChildrenIdsById = wrap(
  fromProduct.getProductCategoryChildrenIdsById,
  state => state.product
);
/**
 * Returns whether multiple product categories are being fetched
 * @param {object} state This state
 * @return {boolean} Whether product categories are being fetched
 */
export const isFetchingProductCategories = wrap(
  fromProduct.isFetchingProductCategories,
  state => state.product
);
/**
 * Returns all product categories
 * @param {object} state This state
 * @return {array} All product categories
 */
export const getProductCategoriesLastFetched = wrap(
  fromProduct.getProductCategoriesLastFetched,
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

/**
 * Returns all posts
 * @param {object} state This state
 * @return {array} All posts
 */
export const getPosts = wrap(fromPost.getPosts, state => state.post);
/**
 * Retrieves the object with the specified id
 * @param {object} state This state
 * @param {number} id The object id
 * @return {object} The requested object
 */
export const getPostBySlug = wrap(fromPost.getPostBySlug, state => state.post);

/**
 * Gets the timestamp when the last time posts were fetched
 * @returns {number} The timestamp
 */
export const getPostsLastFetched = wrap(
  fromPost.getPostsLastFetched,
  state => state.post
);
/**
 * Checks whether posts are currently being fetched
 * @returns {boolean} Whether they're being fetched
 */
export const isFetchingPosts = wrap(
  fromPost.isFetchingPosts,
  state => state.post
);

/**
 * Returns all pages
 * @param {object} state This state
 * @return {array} All pages
 */
export const getPages = wrap(fromPage.getPages, state => state.page);
/**
 * Retrieves the object with the specified id
 * @param {object} state This state
 * @param {number} id The object id
 * @return {object} The requested object
 */
export const getPageBySlug = wrap(fromPage.getPageBySlug, state => state.page);

/**
 * Retrieves the latest fetch error
 * @param {Object} state The redux state
 * @returns {Error} The fetch error
 */
export const getShoppingCartError = wrap(
  fromShoppingCart.getShoppingCartError,
  state => state.shoppingCart
);
/**
 * Gets all items that are currenlty in the shopping cart
 * @param {Object} state The redux state
 * @returns {Array} The cart items
 */
export const getShoppingCartItems = wrap(
  fromShoppingCart.getShoppingCartItems,
  state => state.shoppingCart
);
/**
 * Gets the total price of the cart
 * @param {Object} state The redux state
 * @returns {number} The sum
 */
export const getShoppingCartTotal = wrap(
  fromShoppingCart.getShoppingCartTotal,
  state => state.shoppingCart
);
/**
 * Gets the shopping cart taxes
 * @param {Object} state The redux state
 * @returns {number} The taxes
 */
export const getShoppingCartTaxes = wrap(
  fromShoppingCart.getShoppingCartTaxes,
  state => state.shoppingCart
);
/**
 * Gets the shopping cart fees
 * @param {Object} state The redux state
 * @returns {number} The fees
 */
export const getShoppingCartFees = wrap(
  fromShoppingCart.getShoppingCartFees,
  state => state.shoppingCart
);
export const getShoppingCartCoupons = wrap(
  fromShoppingCart.getShoppingCartCoupons,
  state => state.shoppingCart
);
/**
 * Gets the shopping shipping
 * @param {Object} state The redux state
 * @returns {number} The shipping
 */
export const getShoppingCartShipping = wrap(
  fromShoppingCart.getShoppingCartShipping,
  state => state.shoppingCart
);
/**
 * Checks whether the shopping cart is currently being fetched
 * @param {Object} state The redux state
 * @returns {boolean} Whether the cart is being fetched
 */
export const isFetchingShoppingCart = wrap(
  fromShoppingCart.isFetchingShoppingCart,
  state => state.shoppingCart
);
/**
 * Gets the last time the shopping cart was fetched
 * @param {Object} state The redux state
 * @returns {number} The unix timestamp
 */
export const getShoppingCartLastFetched = wrap(
  fromShoppingCart.getShoppingCartLastFetched,
  state => state.shoppingCart
);

/**
 * Gets all countries
 * @param {Object} state The redux state
 * @returns {Object} All countries
 */
export const getCountries = wrap(
  fromCountries.getCountries,
  state => state.countries
);
/**
 * Gets the last time all countries were fetched
 * @param {Object} state The redux state
 * @returns {number} The unix timestamp
 */
export const getCountriesLastFetched = wrap(
  fromCountries.getCountriesLastFetched,
  state => state.countries
);
/**
 * Checks whether countries are being fetched
 * @param {Object} state The redux state
 * @returns {boolean} Whether countries are being fetched
 */
export const isFetchingCountries = wrap(
  fromCountries.isFetchingCountries,
  state => state.countries
);

/**
 * Gets all sales
 * @param {Object} state The redux state
 * @returns {Object} All sales
 */
export const getSales = wrap(fromSales.getSales, state => state.sales);
/**
 * Gets all sticky posts
 * @param {Object} state The redux state
 * @returns {Object} All sales
 */
export const getStickyPosts = wrap(
  fromSales.getStickyPosts,
  state => state.sales
);
/**
 * Gets the last time all sales were fetched
 * @param {Object} state The redux state
 * @returns {number} The unix timestamp
 */
export const getSalesLastFetched = wrap(
  fromSales.getSalesLastFetched,
  state => state.sales
);
/**
 * Checks whether sales are being fetched
 * @param {Object} state The redux state
 * @returns {boolean} Whether sales are being fetched
 */
export const isFetchingSales = wrap(
  fromSales.isFetchingSales,
  state => state.sales
);

/**
 * Gets the user account
 * @param {Object} state The redux state
 * @returns {Object} The user account
 */
export const getAccount = wrap(fromAccount.getAccount, state => state.account);
/**
 * Gets the last time the user account was fetched
 * @param {Object} state The redux state
 * @returns {Object} The user account
 */
export const getAccountLastFetched = wrap(
  fromAccount.getAccountLastFetched,
  state => state.account
);
/**
 * Gets the reseller discount for a product
 * @param {Object} state The redux state
 * @param {number} productId The product id
 * @returns {number|boolean} The discount in percent
 */
export const getResellerDiscountByProductId = wrap(
  fromAccount.getResellerDiscountByProductId,
  state => state.account
);
/**
 * Gets the reseller discount for the current user
 * @param {Object} state The redux state
 * @returns {number|boolean} The discount
 */
export const getResellerDiscount = wrap(
  fromAccount.getResellerDiscount,
  state => state.account
);

/**
 * Checks if the user is authenticated
 * @param {Object} state The redux state
 * @returns {boolean} Whether the user is authenticated
 */
export const getIsAuthenticated = state => state.isAuthenticated;

/**
 * Gets all orders
 * @param {Object} state The redux state
 * @returns {Object} All orders
 */
export const getOrders = wrap(fromOrders.getOrders, state => state.orders);
/**
 * Gets the last time all orders were fetched
 * @param {Object} state The redux state
 * @returns {number} The unix timestamp
 */
export const getOrdersLastFetched = wrap(
  fromOrders.getOrdersLastFetched,
  state => state.orders
);

/**
 * Gets the current language based on the router location
 * @param {Object} state The redux state
 * @returns {string} The language key
 */
export const getLanguage = state => {
  return getLanguageFromPathname(state.router.location.pathname);
};

/**
 * Gets the current language based on the router location
 * @param {Object} state The redux state
 * @returns {string} The language key
 */
export const getLanguageFetchString = state => {
  return languageToFetchString(getLanguage(state));
};

/**
 * Creates the app reducer
 * @param {Object} history The history object
 * @returns {function} The app reducer
 */
const createAppReducer = history =>
  combineReducers({
    router: createRouterReducer(history),
    loadingBar,
    burgerMenu,
    productSearch,
    shoppingCart,
    product,
    simpleProduct,
    attachment,
    post,
    page,
    countries,
    sales,
    account,
    orders,
    isAuthenticated: (state = false, action) => {
      switch (action.type) {
        case "LOGIN_USER":
          return !action.isFetching && !action.error ? action.success : state;
        default:
          return state;
      }
    }
  });

/**
 * Creates the root reducer based on the app reducer
 * Make sure that the state is removed if the user signed out of the application.
 * @param {function} appReducer The app reducer
 * @returns {function} The root reducer
 */
const rootReducer = appReducer => (state, action) => {
  if (action.type === "LOGOUT_USER") {
    state = undefined;
  }

  if (
    action.type === "FETCH_SHOPPING_CART" &&
    action.loggedIn === false &&
    getIsAuthenticated(state) === true
  ) {
    state = undefined;
  }

  return appReducer(state, action);
};

/**
 * Creates the root reducer
 * @param {Object} history The history object
 * @returns {function} The root reducer
 */
export const createRootReducer = history =>
  rootReducer(createAppReducer(history));
