import { combineReducers } from "redux";
import pluralize from "pluralize";
import changeCase from "change-case";

export const createAllIds = name => (state = [], action) => {
	switch (action.type) {
		case "FETCH_" + changeCase.snakeCase(name).toUpperCase():
			return action.itemId
				? !action.isFetching && action.item && !action.status
					? state.includes(action.itemId) ? state : [...state, action.itemId]
					: state.filter(item => item.id !== action.itemId)
				: state;
		case "FETCH_" + changeCase.snakeCase(pluralize(name)).toUpperCase():
			return action.items
				? [
						...state,
						...action.items
							.map(item => item.id)
							.filter(id => !state.includes(id))
					]
				: action.itemIds
					? [...state, ...action.itemIds.filter(id => !state.includes(id))]
					: state;
		default:
			return state;
	}
};

export const createById = name => (state = {}, action) => {
	switch (action.type) {
		case "FETCH_" + changeCase.snakeCase(name).toUpperCase():
			return {
				...state,
				[action.itemId]: {
					...action.item,
					isFetching: action.isFetching,
					status: action.status
				}
			};
		case "FETCH_" + changeCase.snakeCase(pluralize(name)).toUpperCase():
			return action.isFetching || action.status || action.items.length === 0
				? state
				: {
						...state,
						...action.items.reduce((object, item) => {
							object[item.id] = {
								...item,
								isFetching: action.isFetching,
								status: action.status
							};
							return object;
						}, {})
					};
		default:
			return state;
	}
};

/**
 * Creates a normalized reducer
 * @param {string} name The item name used for the actions
 * @return {function} The reducer
 */
export const createReducer = name =>
	combineReducers({
		byId: createById(name),
		allIds: createAllIds(name)
	});

/**
 * Gets a single item based on its id
 * @param {object} state This item's part of the redux state
 * @param {number} itemId The items id to look for
 * @return {object} The item
 */
export const getItemById = (state, itemId) => state.byId[itemId];

/**
 * Gets all items
 * @param {object} state This item's part of the redux state
 * @return {array} All items
 */
export const getAllItems = state => state.allIds.map(id => state.byId[id]);

/**
 * Wraps a function, useful for redux getters
 * @param {function} target The function to wrap
 * @param {function} mapState Maps the state to the part that should be passed
 * @return {function} The wrapped function
 */
export const wrap = (target, mapState) => (...args) =>
	target(mapState(args[0]), ...args.slice(1));
