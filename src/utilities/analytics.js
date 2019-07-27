import { isClient } from "./ssr";

//prevents memory leak while ssr
let paq = { push: () => {} };

if (isClient) {
  window._paq = window._paq || [];
  paq = window._paq;

  window.onload = () => {
    //track page view after cart has been loaded
    paq.push([
      "setCustomUrl",
      window.location.pathname + window.location.search
    ]);
    paq.push(["trackPageView"]);
  };
}

//paq.push(["requireConsent"]);
//paq.push(["rememberConsentGiven"]); stored in localStorage

//Measure time spent on site
paq.push(["enableHeartBeatTimer"]);

//
paq.push(["setDomains", ["*.shop.feuerschutz.ch"]]);

//tracks content impressions
paq.push(["trackVisibleContentImpressions", true]);

/**
 * Tracks search results
 * @param {string} keyword Search keyword searched for
 * @param {string|boolean} [category=false] Search category selected in your search engine. If you do not need this, set to false
 * @param {number|boolean} [resultCount=false] Number of results on the Search results page. Zero indicates a 'No Result Search Keyword'. Set to false if you don't know
 * @returns {void}
 */
export const trackSiteSearch = (
  keyword,
  category = false,
  resultCount = false
) => paq.push(["trackSiteSearch", keyword, category, resultCount]);

/**
 * Tracks a new page view and deletes previous custom variables
 * @param {string} url The url
 * @param {string} previousUrl The previous url (referrer)
 * @param {number} [generationTime=0] The time it took to generate the page
 * @returns {void}
 */
export const trackPageView = (
  url = location.pathname + location.search,
  previousUrl = undefined,
  generationTime = 0
) => {
  paq.push(["setCustomUrl", url]);
  if (previousUrl) {
    paq.push(["setReferrerUrl", previousUrl]);
  }
  if (generationTime > 0) {
    paq.push(["setGenerationTimeMs", generationTime]);
  }
  //paq.push(["enableLinkTracking"]); //rescan DOM for links
  //paq.push(["trackContentImpressionsWithinNode", document]); //rescan DOM for content impressions
  paq.push(["deleteCustomVariables", "page"]);
  paq.push(["trackPageView"]);
};

/**
 * Tracks an event in matomo
 * @param {string} category The event category
 * @param {string} action The event action (what happened)
 * @param {string} [name] An optional name for the event
 * @param {number} value An optional numeric value
 * @returns {void}
 */
export const trackEvent = (category, action, name, value) =>
  paq.push(["trackEvent", category, action, name, value]);

/**
 * Tracks a goal
 * @param {number} goalId The goal id
 * @param {*} [value] An optional numeric value
 * @returns {void}
 */
export const trackGoal = (goalId, value) =>
  paq.push(["trackGoal", goalId, value]);

/**
 * Sets the current view to be a product view
 * @param {string} sku The sku
 * @param {string} name The product name
 * @param {number} price The product price
 * @returns {void}
 */
export const setProductView = (sku, name, price) =>
  paq.push(["setEcommerceView", sku, name, false, price]);

/**
 * Sets the current view to be a product view
 * @param {string} name The product category name
 * @returns {void}
 */
export const setProductCategoryView = name =>
  paq.push(["setEcommerceView", false, false, name]);

/**
 * Adds an item to a cart
 * @param {string} sku The product sku
 * @param {string} name The product name
 * @param {string} category The product category name
 * @param {number} price The product's price
 * @param {number} quantity The quantity
 * @returns {void}
 */
export const addCartItem = (
  sku,
  name,
  category = ["Uncategorized"],
  price,
  quantity
) => {
  paq.push(["addEcommerceItem", sku, name, category, price, quantity]);
};

/**
 * Updates the cart
 * @param {number} total The total after the update
 * @returns {void}
 */
export const trackCartUpdate = total =>
  paq.push(["trackEcommerceCartUpdate", total]);

/**
 * Adds an item to a cart
 * @param {string} sku The product sku
 * @param {string} name The product name
 * @param {string} category The product category name
 * @param {number} price The product's price
 * @param {number} quantity The quantity
 * @param {number} total The total after adding the item
 * @returns {void}
 */
export const trackAddingCartItem = (
  sku,
  name,
  category,
  price,
  quantity,
  total
) => {
  addCartItem(sku, name, category, price, quantity);
  trackCartUpdate(total);
};

/**
 * Removes a item from the cart
 * @param {string} sku The product's sku
 * @param {number} total The total after removing the item
 * @returns {void}
 */
export const trackRemovingCartItem = (sku, total) => {
  paq.push(["removeEcommerceItem", sku]);
  trackCartUpdate(total);
};

/**
 * Clears the cart
 * @returns {void}
 */
export const clearCart = () => paq.push(["clearEcommerceCart"]);

/**
 * Clears the cart
 * @returns {void}
 */
export const trackClearingCart = () => {
  clearCart();
  trackCartUpdate(0);
};

/**
 * Tracks an order
 * @param {number} orderId The order id
 * @param {number} total The total amount of money
 * @param {number} [subtotal] The subtotal
 * @param {number} [taxes] The amount of taxes
 * @param {number} [shipping] The amount of shipping
 * @param {number} [discount] The amount of discount
 * @returns {void}
 */
export const trackOrder = (
  orderId,
  total,
  subtotal,
  taxes,
  shipping,
  discount
) =>
  paq.push([
    "trackEcommerceOrder",
    orderId,
    total,
    subtotal,
    taxes,
    shipping,
    discount
  ]);

/**
 * Tracks the user's id
 * @param {string} userId The user's id
 * @returns {void}
 */
export const trackUserId = userId => paq.push(["setUserId", userId]);

/**
 * Removes the user id
 * @param {string} userId The user id
 * @returns {void}
 */
export const untrackUserId = () => paq.push(["resetUserId"]);

/**
 * Enables analytics
 * @returns {void}
 */
export const giveConsent = () => paq.push(["setConsentGiven"]);

/**
 * Disables analytics
 * @returns {void}
 */
export const removeConsent = () => paq.push(["forgetConsentGiven"]);
