import pluralize from "pluralize";
import changeCase from "change-case";
import { fetchApi } from "utilities/api";

/**
 * Creates a standardized fetch action
 * @param {string} type The action type string
 * @param {...string} attributes Additional action property names
 */
export const createFetchAction = (type = "", ...attributes) => (
	isFetching = false,
	error = null,
	visualize = false,
	...args
) => ({
	type,
	isFetching,
	error,
	visualize,
	...attributes.reduce((object, attribute, index) => {
		object[attribute] = args[index];
		return object;
	}, {})
});

/**
 * Creates a redux action for fetching one item of a type
 * @param {string} name The singular name of the item type
 * @param {...string} attributes Additional action property names
 * @return {function} The redux action
 */
export const createFetchSingleItemAction = (name, ...attributes) =>
	createFetchAction(
		"FETCH_" + changeCase.snakeCase(name).toUpperCase(),
		"itemId",
		"item",
		...attributes
	);

/**
 * Creates a redux thunk that fetches a single item of a certain type
 * @param {function} action The action that should be dispatched
 * @param {function} endpoint A function generating the endpoint url based on the item id and the passed arguments
 * @param {function} mapItem A function mapping the item into the desired format
 * @return {function} The redux thunk
 */
export const createFetchSingleItemThunk = (
	action,
	endpoint,
	mapItem = item => item
) => (itemId, visualize = false, ...attributes) => dispatch => {
	dispatch(action(true, null, visualize, itemId, null, ...attributes));

	return fetchApi(endpoint(itemId, ...attributes), {
		method: "GET"
	})
		.then(({ json: item }) => {
			const mappedItem = mapItem(item);

			dispatch(
				action(false, null, visualize, itemId, mappedItem, ...attributes)
			);

			return Promise.resolve({ item: mappedItem, originalItem: item });
		})
		.catch(error => {
			dispatch(action(false, error, visualize, itemId, null, ...attributes));

			return Promise.reject(error);
		});
};

/**
 * Creates a redux action for fetching all items of a type
 * @param {string} name The singular name of the item type
 * @param {...string} attributes Additional action property names
 * @return {function} The redux action
 */
export const createFetchItemsAction = (name, ...attributes) =>
	createFetchAction(
		"FETCH_" + changeCase.snakeCase(pluralize(name)).toUpperCase(),
		"items",
		...attributes
	);

/**
 * Creates a redux action for fetching a page of items
 * @param {string} name The singular name of the item type
 * @param {...string} attributes Additional action property names
 * @return {function} The redux action
 */
export const createFetchItemPageAction = (name, ...attributes) =>
	createFetchItemsAction(name, "page", ...attributes);

/**
 * Fetches all items by using a pagination
 * @param {function} dispatch The redux dispatch function
 * @param {function} action The action that should be dispatched
 * @param {function} endpoint A function generating the endpoint url based on the page and the number of items per page
 * @param {function} mapItem A function mapping the item into the desired format
 * @return {promise} A promise yielding all items or an error
 */
export const createFetchItemPageThunk = (
	action,
	endpoint,
	mapItem = item => item
) => (
	page = 1,
	pageTo = -1,
	perPage = 10,
	visualize = false,
	...attributes
) => dispatch => {
	dispatch(action(true, null, visualize, [], page, ...attributes));

	return fetchApi(endpoint(page, perPage, ...attributes), {
		method: "GET"
	}).then(({ json: items, response }) => {
		const total = parseInt(response.headers.get("x-wp-total"));

		const mappedItems = items.map(mapItem);
		dispatch(
			action(page < pageTo, null, visualize, mappedItems, page, ...attributes)
		);

		if (
			(page - 1) * perPage + items.length < total &&
			(pageTo > 0 ? page < pageTo : true)
		) {
			return createFetchItemPageThunk(action, endpoint, mapItem)(
				page + 1,
				pageTo,
				perPage,
				visualize,
				...attributes
			)(dispatch).then(
				({ items: nextItems, originalItems: newOriginalItems }) =>
					Promise.resolve({
						items: [...mappedItems, ...nextItems],
						originalItems: [...items, ...newOriginalItems],
						perPage,
						total
					})
			);
		}
		return Promise.resolve({
			items: mappedItems,
			originalItems: items,
			perPage,
			total
		});
	});
};

/**
 * Creates a redux thunk that fetches all items of a certain type
 * @param {function} action The redux action to dispatch
 * @param {function} endpoint A function generating the endpoint url based on the page and the number of items per page
 * @param {function} mapItem A function mapping the item into the desired format
 * @return {function} The redux thunk
 */
export const createFetchAllItemsThunk = (
	action,
	endpoint,
	mapItem = item => item
) => (perPage = 10, visualize = false, ...attributes) => dispatch => {
	dispatch(action(true, null, visualize, [], null, ...attributes));

	return createFetchItemPageThunk(action, endpoint, mapItem)(
		1,
		-1,
		perPage,
		visualize,
		...attributes
	)(dispatch)
		.then(({ items }) => {
			dispatch(action(false, null, visualize, items, null, ...attributes));

			return Promise.resolve(items);
		})
		.catch(error => {
			dispatch(action(false, error, visualize, [], null, ...attributes));

			return Promise.reject(error);
		});
};

/**
 * Creates a redux thunk that fetches multiple items of a certain type
 * @param {function} action The redux action to dispatch
 * @param {function} endpoint A function generating the endpoint url based on the attributes
 * @param {function} mapItem A function mapping the item into the desired format
 * @return {function} The redux thunk
 */
export const createFetchItemsThunk = (
	action,
	endpoint,
	mapItem = item => item
) => (visualize = false, ...attributes) => dispatch => {
	dispatch(action(true, null, visualize, [], null, ...attributes));

	return fetchApi(endpoint(...attributes), {
		method: "GET"
	})
		.then(({ json: items }) => {
			const mappedItems = items.map(mapItem);
			dispatch(
				action(false, null, visualize, mappedItems, null, ...attributes)
			);
			return Promise.resolve({ items: mappedItems, originalItems: items });
		})
		.catch(error => {
			dispatch(action(false, error, visualize, [], null, ...attributes));

			return Promise.reject(error);
		});
};

/**
 * Creates a redux action for creating an item of a type
 * @param {string} name The singular name of the item type
 * @param {...string} attributes Additional action property names
 * @return {function} The redux action
 */
export const createCreateItemAction = (name, ...attributes) =>
	createFetchAction(
		"CREATE_" + changeCase.snakeCase(name).toUpperCase(),
		"item",
		...attributes
	);

/**
 * Creates a redux thunk that creates an item of a certain type
 * @param {function} action The action that should be dispatched
 * @param {function} endpoint A function generating the endpoint url based on the item and the passed args
 * @param {function} mapItem A function mapping the item into the desired format
 * @return {function} The redux thunk
 */
export const createCreateItemThunk = (
	action,
	endpoint,
	mapItem = item => item
) => (item, visualize = false, ...attributes) => dispatch => {
	dispatch(action(true, null, visualize, item, ...attributes));

	return fetchApi(endpoint(item, ...attributes), {
		method: "POST",
		body: JSON.stringify(item)
	})
		.then(({ json: item }) => {
			const mappedItem = mapItem(item);

			dispatch(action(false, null, visualize, mappedItem, ...attributes));

			return Promise.resolve({ mappedItem, originalItem: item });
		})
		.catch(error => {
			dispatch(action(false, error, visualize, item, ...attributes));

			return Promise.reject(error);
		});
};

/**
 * Creates a redux action for updating an item of a type
 * @param {string} name The singular name of the item type
 * @param {...string} attributes Additional action property names
 * @return {function} The redux action
 */
export const createUpdateItemAction = (name, ...attributes) =>
	createFetchAction(
		"UPDATE_" + changeCase.snakeCase(name).toUpperCase(),
		"itemId",
		"item",
		...attributes
	);

/**
 * Creates a redux thunk that updates an item of a certain type
 * @param {function} action The action that should be dispatched
 * @param {function} endpoint A function generating the endpoint url based on the itemId, the item and the passed attributes
 * @param {function} mapItem A function mapping the item into the desired format
 * @return {function} The redux thunk
 */
export const createUpdateItemThunk = (
	action,
	endpoint,
	mapItem = item => item
) => (itemId, item, visualize = false, ...attributes) => dispatch => {
	dispatch(action(true, null, visualize, itemId, item, ...attributes));

	return fetchApi(endpoint(itemId, item, ...attributes), {
		method: "PUT",
		body: JSON.stringify(item),
		headers: new Headers({
			"Content-Type": "application/json"
		})
	})
		.then(({ json: item }) => {
			const mappedItem = mapItem(item);

			dispatch(
				action(false, null, visualize, itemId, mappedItem, ...attributes)
			);

			return Promise.resolve({ item, originalItem: item });
		})
		.catch(error => {
			dispatch(action(false, error, visualize, itemId, item, ...attributes));

			return Promise.reject(error);
		});
};

/**
 * Creates a redux action for deleting an item of a type
 * @param {string} name The singular name of the item type
 * @param {...string} attributes Additional action property names
 * @return {function} The redux action
 */
export const createDeleteItemAction = (name, ...attributes) =>
	createFetchAction(
		"DELETE_" + changeCase.snakeCase(name).toUpperCase(),
		"itemId",
		...attributes
	);

/**
 * Creates a redux thunk that deletes an item of a certain type
 * @param {function} action The action that should be dispatched
 * @param {function} endpoint A function generating the endpoint url based on the item and the passed attributes
 * @return {function} The redux thunk
 */
export const createDeleteItemThunk = (action, endpoint) => (
	itemId,
	visualize = false,
	...attributes
) => dispatch => {
	dispatch(action(true, null, visualize, itemId, ...attributes));

	return fetchApi(endpoint(itemId, ...attributes), {
		method: "DELETE",
		headers: new Headers({
			"Content-Type": "application/json"
		})
	})
		.then(() => {
			dispatch(action(false, null, visualize, itemId, ...attributes));

			return Promise.resolve();
		})
		.catch(error => {
			dispatch(action(false, error, visualize, itemId, ...attributes));

			return Promise.reject(error);
		});
};

/**
 * Creates a redux action for deleting one item of a type
 * @param {string} name The singular name of the item type
 * @return {function} The redux action
 */
export const createRemoveSingleItemAction = name =>
	createFetchAction(
		"DELETE_" + changeCase.snakeCase(name).toUpperCase(),
		"itemId",
		"item"
	);

/**
 * Creates a redux thunk that deletes a single item of a certain type
 * @param {function} action The action that should be dispatched
 * @param {function} endpoint A function generating the endpoint url based on the item id and the passed arguments
 * @return {function} The redux thunk
 */
export const createRemoveSingleItemThunk = (action, endpoint) => (
	itemId,
	args = {},
	visualize = false
) => dispatch => {
	dispatch(action(true, null, visualize, itemId));

	return fetchApi(endpoint(itemId, args), {
		method: "DELETE"
	})
		.then(() => {
			dispatch(action(false, null, visualize, itemId));

			return Promise.resolve();
		})
		.catch(error => {
			dispatch(action(false, error, visualize, itemId));

			return Promise.reject(error);
		});
};