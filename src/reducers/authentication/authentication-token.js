const defaultState = { isFetching: false, error: null, token: {} };

/**
 * The authentication token reducer
 * @param {object} state The redux state
 * @param {object} action The dispatched action
 * @return {object} The new state
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
 * @param {object} authenticationToken This part of the redux state
 * @return {boolean} Whether the user is logged in
 */
export const getLoggedIn = authenticationToken =>
	authenticationToken.isFetching === false &&
	authenticationToken.error === null &&
	Object.keys(authenticationToken.token).length !== 0;
/**
 * Returns the authentication token
 * @param {object} authenticationToken This part of the redux state
 * @return {object} The jwt token
 */
export const getAuthenticationToken = authenticationToken =>
	authenticationToken.token;
/**
 * Checks whether the token is currently being fetched
 * @param {object} authenticationToken This part of the redux state
 * @return {boolean} Whether the token is being fetched
 */
export const getAuthenticationTokenFetching = authenticationToken =>
	authenticationToken.isFetching;
/**
 * Returns the error of the jwt token
 * @param {object} authenticationToken This part of the redux state
 * @return {error} The current error
 */
export const getAuthenticationTokenError = authenticationToken =>
	authenticationToken.error;
