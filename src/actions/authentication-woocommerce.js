/**
 * Action called after receiving the woocommerce credentials
 * @param {string} key The received key
 * @param {string} secret The received secret
 * @returns {Object} The redux action
 */
export const receiveWoocommerceCredentials = (key, secret) => ({
  type: "RECEIVE_WOOCOMMERCE_CREDENTIALS",
  key,
  secret
});

/**
 * Logs the user out and resets the jwt token
 * @returns {Object} The redux action
 */
export const resetWoocommerceCredentials = () => ({
  type: "RESET_WOOOMMERCE_CREDENTIALS"
});
