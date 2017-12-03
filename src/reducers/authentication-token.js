const defaultState = { isFetching: false, status: null, token: {} };

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
				status:
					action.status || action.status === null
						? action.status
						: state.status,
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
	authenticationToken.status === null &&
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
 * Returns the status of the jwt token
 * @param {object} authenticationToken This part of the redux state
 * @return {error} The current status
 */
export const getAuthenticationTokenStatus = authenticationToken =>
	authenticationToken.status;
