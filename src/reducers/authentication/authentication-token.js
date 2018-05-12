const defaultState = { isFetching: false, error: null, token: {} };

/**
 * The authentication token reducer
 * @param {Object} state The redux state
 * @param {Object} action The dispatched action
 * @returns {Object} The new state
 */
const authenticationTokenReducer = (state = defaultState, action) => {
	switch (action.type) {
		case "FETCH_JWT_TOKEN":
			return {
				...state,
				isFetching: action.isFetching,
				error:
					action._error || action._error === null
						? action._error
						: state._error,
				token: action.token ? action.token : state.token
			};
		case "RESET_JWT_TOKEN":
			return defaultState;
		default:
			return state;
	}
};

export default authenticationTokenReducer;

/**
 * Checks whether the user is logged in
 * @param {Object} authenticationToken This part of the redux state
 * @returns {boolean} Whether the user is logged in
 */
export const getLoggedIn = authenticationToken =>
	authenticationToken.isFetching === false &&
	authenticationToken.error === null &&
	Object.keys(authenticationToken.token).length !== 0;
/**
 * Returns the authentication token
 * @param {Object} authenticationToken This part of the redux state
 * @returns {Object} The jwt token
 */
export const getAuthenticationToken = authenticationToken =>
	authenticationToken.token;
/**
 * Checks whether the token is currently being fetched
 * @param {Object} authenticationToken This part of the redux state
 * @returns {boolean} Whether the token is being fetched
 */
export const getAuthenticationTokenFetching = authenticationToken =>
	authenticationToken.isFetching;
/**
 * Returns the error of the jwt token
 * @param {Object} authenticationToken This part of the redux state
 * @returns {Error} The current error
 */
export const getAuthenticationTokenError = authenticationToken =>
	authenticationToken.error;
