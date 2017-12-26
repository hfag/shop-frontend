import pluralize from "pluralize";
import changeCase from "change-case";
import { fetchApi } from "utilities/api";

/**
 * Creates a redux action for fetching one item of a type
 * @param {string} name The singular name of the item type
 * @return {function} The redux action
 */
export const createFetchSingleItemAction = name => (
	isFetching,
	status,
	itemId,
	item
) => ({
	type: "FETCH_" + changeCase.snakeCase(name).toUpperCase(),
	isFetching,
	status,
	itemId,
	item
});

/**
 * Creates a redux thunk that fetches a single item of a certain type
 * @param {function} dispatch The redux dispatch function
 * @param {function} action The action that should be dispatched
 * @param {function} mapItem A function mapping the item into the desired format
 * @return {function} The redux thunk
 */
export const createFetchSingleItemThunk = (
	action,
	endpoint,
	mapItem = item => item
) => itemId => dispatch => {
	dispatch(action(true, null, itemId));

	return fetchApi(endpoint(itemId), {
		method: "GET"
	})
		.then(response => response.json())
		.then(item => {
			const mappedItem = mapItem(item);

			dispatch(action(false, null, itemId, mappedItem));

			return Promise.resolve(mappedItem);
		})
		.catch(error => {
			dispatch(action(false, error, itemId));

			return Promise.reject(error);
		});
};

/**
 * Creates a redux action for fetching all items of a type
 * @param {string} name The singular name of the item type
 * @return {function} The redux action
 */
export const createFetchItemsAction = name => (
	isFetching,
	status,
	args = {},
	items = []
) => ({
	type: "FETCH_" + changeCase.snakeCase(pluralize(name)).toUpperCase(),
	isFetching,
	status,
	args,
	items
});

/**
 * Fetches all items by using a pagination
 * @param {function} dispatch The redux dispatch function
 * @param {function} action The action that should be dispatched
 * @param {function} endpoint A function generating the endpoint url based on the page and the number of items per page
 * @param {function} total A function getting the total amount of pages from a response (e.g. read a header)
 * @param {function} mapItem A function mapping the item into the desired format
 * @param {number} [perPage=10] The amount of items per page
 * @return {promise} A promise yielding all items or an error
 */
export const createFetchItemPageThunk = (
	action,
	endpoint,
	total,
	mapItem = item => item,
	perPage = 10
) => (page = 1, pageTo = -1, args = {}) => dispatch =>
	fetchApi(endpoint(page, perPage, args), {
		method: "GET"
	}).then(response => {
		return response.json().then(items => {
			const totalItems = total(response);

			dispatch(
				action(false, null, args, items.map(item => mapItem(item, page, args)))
			);

			if (
				(page - 1) * perPage + items.length < totalItems &&
				(pageTo > 0 ? page <= pageTo : true)
			) {
				return createFetchItemPageThunk(
					action,
					endpoint,
					total,
					mapItem,
					perPage
				)(page + 1, pageTo, args)(dispatch).then(({ items: nextItems }) =>
					Promise.resolve({ items: [...items, ...nextItems], totalItems })
				);
			}

			return Promise.resolve({ items, totalItems });
		});
	});

/**
 * Creates a redux thunk that fetches all items of a certain type
 * @param {function} action The redux action to dispatch
 * @param {function} endpoint A function generating the endpoint url based on the page and the number of items per page
 * @param {function} total A function getting the total amount of pages from a response (e.g. read a header)
 * @param {function} mapItem A function mapping the item into the desired format
 * @param {number} [perPage=10] The amount of items per page
 * @return {function} The redux thunk
 */
export const createFetchAllItemsThunk = (
	action,
	endpoint,
	total,
	mapItem = item => item,
	perPage = 10
) => (args = {}) => dispatch => {
	dispatch(action(true, null));

	return createFetchItemPageThunk(action, endpoint, total, mapItem, perPage)(
		1,
		-1,
		args
	)(dispatch)
		.then(({ items }) => {
			dispatch(action(false, null, args, items.map(mapItem)));

			return Promise.resolve({ items });
		})
		.catch(error => {
			dispatch(action(false, error, []));

			return Promise.reject(error);
		});
};
