const defaultState = { key: null, secret: null };

/**
 * The authentication token reducer
 * @param {Object} state The redux state
 * @param {Object} action The dispatched action
 * @returns {Object} The new state
 */
const credentialsReducer = (state = defaultState, action) => {
	switch (action.type) {
		case "RECEIVE_WOOCOMMERCE_CREDENTIALS":
			return {
				key: action.key,
				secret: action.secret
			};
		case "RESET_WOOOMMERCE_CREDENTIALS":
			return defaultState;
		default:
			return state;
	}
};

export default credentialsReducer;

/**
 * Checks whether the user is logged in
 * @param {Object} credentials This part of the redux state
 * @returns {boolean} Whether the user is logged in
 */
export const getLoggedIn = credentials =>
	credentials.key !== null && credentials.secret !== null;
/**
 * Returns the authentication token
 * @param {Object} credentials This part of the redux state
 * @returns {Object} The woocommerce credentials
 */
export const getCredentials = credentials => ({
	key: credentials.key,
	secret: credentials.secret
});
