import { fetchApi } from "api-utilities";

/**
 * Action called before and after fetching
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} status If there was an error during the request, this field should contain it
 * @param {number} attachmentId The requested item id
 * @param {object} attachment The received item
 * @returns {object} The redux action
 */
const fetchAttachment = (isFetching, status, attachmentId, attachment) => ({
	type: "FETCH_ATTACHMENT",
	isFetching,
	status,
	attachmentId,
	attachment
});

/**
 * Action called before and after fetching
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} status If there was an error during the request, this field should contain it
 * @param {number} attachmentId The requested item id
 * @param {array} attachments The received items
 * @returns {object} The redux action
 */
const fetchAttachments = (isFetching, status, attachmentId, attachments) => ({
	type: "FETCH_ATTACHMENTS",
	isFetching,
	status,
	attachmentId,
	attachment
});

/**
 * Fetches a single item
 * @param {number} attachmentId The id of the requested item
 * @returns {function} A redux thunk
 */
export const fetch = attachmentId => dispatch => {
	dispatch(fetchAttachment(true, null, attachmentId));

	return fetchApi("/wp-json/wp/v2/media/" + attachmentId, {
		method: "GET"
	})
		.then(response => response.json())
		.then(attachment => {
			const {
				id,
				date,
				caption,
				mime_type: mimeType,
				media_details: { width, height, sizes },
				source_url: url
			} = attachment;
			dispatch(
				fetchAttachment(false, null, attachmentId, {
					id,
					date,
					caption,
					mimeType,
					width,
					height,
					url,
					sizes
				})
			);

			return Promise.resolve(attachment);
		})
		.catch(error => {
			dispatch(fetchAttachment(false, error, attachmentId));

			return Promise.reject(error);
		});
};

/**
 * Fetches all items by using the pagination
 * @param {number} [page=1] What page should be queried
 * @return {promise} A promise returning the item array or an error
 */
const fetchByPage = (page = 1, perPage = 10) =>
	fetchApi("/wp-json/wp/v2/media/?&page=" + page + "&per_page=" + perPage, {
		method: "GET"
	}).then(response => {
		return response.json().then(items => {
			const totalItems = parseInt(response.headers.get("x-wp-total"));

			if ((page - 1) * perPage + items.length < totalItems) {
				return fetchByPage(page + 1).then(nextItems =>
					Promise.resolve([...items, ...nextItems])
				);
			}

			return Promise.resolve(items);
		});
	});

/**
 * Fetches all items
 * @returns {function} A redux thunk
 */
export const fetchAll = () => dispatch => {
	dispatch(fetchAttachments(true, null));

	return fetchByPage()
		.then(items => {
			dispatch(
				fetchAttachments(
					false,
					null,
					items.map(
						({
							id,
							date,
							caption,
							mime_type: mimeType,
							media_details: { width, height, sizes },
							source_url: url
						}) => ({
							id,
							date,
							caption,
							mimeType,
							width,
							height,
							url,
							sizes
						})
					)
				)
			);

			return Promise.resolve(items);
		})
		.catch(error => {
			dispatch(fetchAttachments(false, error, []));

			return Promise.reject(error);
		});
};
