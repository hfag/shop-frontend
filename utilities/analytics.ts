import { isClient } from "./ssr";

interface Paq {
  push: (args: any[]) => void;
}

declare global {
  interface Window {
    _paq: Paq;
  }
}

//prevents memory leak while ssr
let paq: Paq = { push: () => {} };

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
//paq.push(["trackVisibleContentImpressions", true]);

/**
 * Tracks search results
 * @param {string} keyword Search keyword searched for
 * @param {string|boolean} [category=false] Search category selected in your search engine. If you do not need this, set to false
 * @param {number|boolean} [resultCount=false] Number of results on the Search results page. Zero indicates a 'No Result Search Keyword'. Set to false if you don't know
 * @returns {void}
 */
export const trackSiteSearch = (
  keyword: string,
  category: string | boolean = false,
  resultCount: number | boolean = false
) => paq.push(["trackSiteSearch", keyword, category, resultCount]);

/**
 * Tracks a new page view and deletes previous custom variables
 * @param {string} url The url
 * @param {string} previousUrl The previous url (referrer)
 * @param {number} [generationTime=0] The time it took to generate the page
 * @returns {void}
 */
export const trackPageView = (
  url: string = location.pathname + location.search,
  previousUrl: string = undefined,
  generationTime: number = 0
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
export const trackEvent = (
  category: string,
  action: string,
  name?: string,
  value?: string
) => paq.push(["trackEvent", category, action, name, value]);

/**
 * Tracks a goal
 * @param {number} goalId The goal id
 * @param {*} [value] An optional numeric value
 */
export const trackGoal = (goalId: number, value: number) =>
  paq.push(["trackGoal", goalId, value]);

/**
 * Sets the current view to be a product view
 * @param {string} sku The sku
 * @param {string} name The product name
 * @param {number} price The product price
 */
export const setProductView = (sku: string, name: string, price: number) =>
  paq.push(["setEcommerceView", sku, name, false, price]);

/**
 * Sets the current view to be a product view
 * @param {string} name The product category name
 */
export const setProductCategoryView = (name: string) =>
  paq.push(["setEcommerceView", false, false, name]);

/**
 * Adds an item to a cart
 * @param {string} sku The product sku
 * @param {string} name The product name
 * @param {string} category The product category name
 * @param {number} price The product's price
 * @param {number} quantity The quantity
 */
export const addCartItem = (
  sku: string,
  name: string,
  category: string | string[] = ["Uncategorized"],
  price: number,
  quantity: number
) => {
  paq.push(["addEcommerceItem", sku, name, category, price, quantity]);
};

/**
 * Updates the cart
 * @param {number} total The total after the update
 * @returns {void}
 */
export const trackCartUpdate = (total) =>
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
  sku: string,
  name: string,
  category: string,
  price: number,
  quantity: number,
  total: number
) => {
  addCartItem(sku, name, category, price, quantity);
  trackCartUpdate(total);
};

/**
 * Removes a item from the cart
 * @param {string} sku The product's sku
 * @param {number} total The total after removing the item
 */
export const trackRemovingCartItem = (sku: string, total: number) => {
  paq.push(["removeEcommerceItem", sku]);
  trackCartUpdate(total);
};

/**
 * Clears the cart
 */
export const clearCart = () => paq.push(["clearEcommerceCart"]);

/**
 * Clears the cart
 */
export const trackClearingCart = () => {
  clearCart();
  trackCartUpdate(0);
};

/**
 * Tracks an order
 */
export const trackOrder = (
  orderId: number,
  total: number,
  subtotal: number,
  taxes: number,
  shipping: number,
  discount: number
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
 */
export const trackUserId = (userId: string) => paq.push(["setUserId", userId]);

/**
 * Removes the user id
 * @param {string} userId The user id
 */
export const untrackUserId = () => paq.push(["resetUserId"]);

/**
 * Enables analytics
 */
export const giveConsent = () => paq.push(["setConsentGiven"]);

/**
 * Disables analytics
 */
export const removeConsent = () => paq.push(["forgetConsentGiven"]);
