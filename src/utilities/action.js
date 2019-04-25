import pluralize from "pluralize";
import changeCase from "change-case";

import { fetchApi } from "./api";

/**
 * Creates a standardized fetch action
 * @param {string} type The action type string
 * @param {...string} attributes Additional action property names
 * @returns {function} The action creator
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
 * @returns {function} The redux action
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
 * @param {function} callback A function called before dispatching the action. Can dispatch more actions
 * @returns {function} The redux thunk
 */
export const createFetchSingleItemThunk = (
  action,
  endpoint,
  mapItem = item => item,
  callback
) => (itemId, language, visualize = false, ...attributes) => dispatch => {
  dispatch(action(true, null, visualize, itemId, null, ...attributes));

  return fetchApi(endpoint(itemId, language, ...attributes), {
    method: "GET"
  })
    .then(({ json: item, response }) => {
      const mappedItem = mapItem(item);

      if (callback) {
        return Promise.resolve(
          callback(dispatch, response, item, language, visualize, ...attributes)
        ).then(() => {
          dispatch(
            action(false, null, visualize, itemId, mappedItem, ...attributes)
          );
          return Promise.resolve({ item: mappedItem, originalItem: item });
        });
      } else {
        dispatch(
          action(false, null, visualize, itemId, mappedItem, ...attributes)
        );

        return Promise.resolve({ item: mappedItem, originalItem: item });
      }
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
 * @returns {function} The redux action
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
 * @returns {function} The redux action
 */
export const createFetchItemPageAction = (name, ...attributes) =>
  createFetchItemsAction(name, "page", ...attributes);

/**
 * Fetches all items by using a pagination
 * @param {function} action The action that should be dispatched
 * @param {function} endpoint A function generating the endpoint url based on the page and the number of items per page
 * @param {function} mapItem A function mapping the item into the desired format
 * @param {function} callback A function called before dispatching the action. Can dispatch more actions
 * @returns {promise} A promise yielding all items or an error
 */
export const createFetchItemPageThunk = (
  action,
  endpoint,
  mapItem = item => item,
  callback
) => (
  page = 1,
  pageTo = -1,
  perPage = 10,
  language,
  visualize = false,
  ...attributes
) => dispatch => {
  dispatch(action(true, null, visualize, [], page, ...attributes));

  return fetchApi(endpoint(page, perPage, language, ...attributes), {
    method: "GET"
  }).then(({ json: items, response }) => {
    const total = parseInt(response.headers.get("x-wp-total"));
    const mappedItems = items.map(mapItem);

    if (
      (page - 1) * perPage + items.length < total &&
      (pageTo > 0 ? page < pageTo : true)
    ) {
      if (callback) {
        callback(
          dispatch,
          response,
          items,
          page,
          perPage,
          language,
          visualize,
          total,
          ...attributes
        );
      }

      dispatch(
        action(false, null, visualize, mappedItems, page, ...attributes)
      );

      return createFetchItemPageThunk(action, endpoint, mapItem, callback)(
        page + 1,
        pageTo,
        perPage,
        language,
        visualize,
        ...attributes
      )(dispatch).then(
        ({ items: nextItems, originalItems: newOriginalItems }) =>
          Promise.resolve({
            items: [...mappedItems, ...nextItems],
            originalItems: [...items, ...newOriginalItems]
          })
      );
    }

    if (callback) {
      callback(
        dispatch,
        response,
        items,
        page,
        perPage,
        visualize,
        total,
        ...attributes
      );
    }

    dispatch(action(false, null, visualize, mappedItems, page, ...attributes));

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
 * @param {function} callback A function called before dispatching the action. Can dispatch more actions
 * @returns {function} The redux thunk
 */
export const createFetchAllItemsThunk = (
  action,
  endpoint,
  mapItem = item => item,
  callback
) => (perPage = 10, language, visualize = false, ...attributes) => dispatch => {
  dispatch(action(true, null, visualize, [], null, ...attributes));

  return createFetchItemPageThunk(action, endpoint, mapItem, callback)(
    1,
    -1,
    perPage,
    language,
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
 * @param {function} callback A function called before dispatching the action. Can dispatch more actions
 * @returns {function} The redux thunk
 */
export const createFetchItemsThunk = (
  action,
  endpoint,
  mapItem = item => item,
  callback
) => (language, visualize = false, ...attributes) => dispatch => {
  dispatch(action(true, null, visualize, [], ...attributes));

  return fetchApi(endpoint(language, ...attributes), {
    method: "GET"
  })
    .then(({ json: items }) => {
      const mappedItems = items.map(mapItem);

      if (callback) {
        callback(dispatch, items, language, visualize, ...attributes);
      }

      dispatch(action(false, null, visualize, mappedItems, ...attributes));
      return Promise.resolve({ items: mappedItems, originalItems: items });
    })
    .catch(error => {
      dispatch(action(false, error, visualize, [], ...attributes));

      return Promise.reject(error);
    });
};

/**
 * Creates a redux action for creating an item of a type
 * @param {string} name The singular name of the item type
 * @param {...string} attributes Additional action property names
 * @returns {function} The redux action
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
 * @returns {function} The redux thunk
 */
export const createCreateItemThunk = (
  action,
  endpoint,
  mapItem = item => item
) => (item, language, visualize = false, ...attributes) => dispatch => {
  dispatch(action(true, null, language, visualize, item, ...attributes));

  return fetchApi(endpoint(item, language, ...attributes), {
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
 * @returns {function} The redux action
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
 * @returns {function} The redux thunk
 */
export const createUpdateItemThunk = (
  action,
  endpoint,
  mapItem = item => item
) => (itemId, item, language, visualize = false, ...attributes) => dispatch => {
  dispatch(action(true, null, visualize, itemId, item, ...attributes));

  return fetchApi(endpoint(itemId, item, language, ...attributes), {
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
 * @returns {function} The redux action
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
 * @returns {function} The redux thunk
 */
export const createDeleteItemThunk = (action, endpoint) => (
  itemId,
  language,
  visualize = false,
  ...attributes
) => dispatch => {
  dispatch(action(true, null, visualize, itemId, ...attributes));

  return fetchApi(endpoint(itemId, language, ...attributes), {
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
