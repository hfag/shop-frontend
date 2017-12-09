const defaultState = { key: null, secret: null };

/**
 * The authentication token reducer
 * @param {object} state The redux state
 * @param {object} action The dispatched action
 * @return {object} The new state
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
 * @param {object} credentials This part of the redux state
 * @return {boolean} Whether the user is logged in
 */
export const getLoggedIn = credentials =>
	credentials.key !== null && credentials.secret !== null;
/**
 * Returns the authentication token
 * @param {object} credentials This part of the redux state
 * @return {object} The woocommerce credentials
 */
export const getCredentials = credentials => ({
	key: credentials.key,
	secret: credentials.secret
});
