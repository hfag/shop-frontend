import { fetchApi } from "api-utilities";

/**
 * Action called before and after searching products
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} status If there was an error during the request, this field should contain it
 * @param {number} attachmentId The requested attachment id
 * @param {object} attachment The received attachment
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
 * Fetches product categories
 * @param {number} attachmentId The id of the requested attachment
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
