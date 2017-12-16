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
export const createFetchAllItemsAction = name => (
	isFetching,
	status,
	items
) => ({
	type: "FETCH_" + changeCase.snakeCase(pluralize(name)).toUpperCase(),
	isFetching,
	status,
	items
});

/**
 * Fetches all items by using a pagination
 * @param {function} dispatch The redux dispatch function
 * @param {function} action The action that should be dispatched
 * @param {function} endpoint A function generating the endpoint url based on the page and the number of items per page
 * @param {function} total A function getting the total amount of pages from a response (e.g. read a header)
 * @param {function} mapItem A function mapping the item into the desired format
 * @param {number} perPage The amount of items per page
 * @param {number} page The page that should be fetched
 * @return {promise} A promise yielding all items or an error
 */
const fetchByPage = (
	dispatch,
	action,
	endpoint,
	total,
	mapItem = item => item,
	perPage = 20,
	page = 1
) =>
	fetchApi(endpoint(page, perPage), {
		method: "GET"
	}).then(response => {
		return response.json().then(items => {
			const totalItems = total(response);

			if ((page - 1) * perPage + items.length < totalItems) {
				if (total && total.length) {
					dispatch(action(false, null, items.map(mapItem)));
				}

				return fetchByPage(
					dispatch,
					action,
					endpoint,
					total,
					mapItem,
					page + 1,
					perPage
				).then(nextItems => Promise.resolve([...items, ...nextItems]));
			}

			return Promise.resolve(items);
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
) => () => dispatch => {
	dispatch(action(true, null));

	return fetchByPage(dispatch, action, endpoint, total, mapItem, perPage)
		.then(items => {
			dispatch(action(false, null, items.map(mapItem)));

			return Promise.resolve(items);
		})
		.catch(error => {
			dispatch(action(false, error, []));

			return Promise.reject(error);
		});
};
