import { fetchApi } from "api-utilities";

/**
 * Action called before and after searching products
 * @param {boolean} isFetching Whether it is currently being fetched
 * @param {string} status If there was an error during the request, this field should contain it
 * @param {object} categories The received categories
 * @returns {object} The redux action
 */
const fetchProductCategories = (isFetching, status, categories) => ({
	type: "FETCH_PRODUCT_CATEGORIES",
	isFetching,
	status,
	categories
});

/**
 * Fetches a product category page
 * @param {number} [page=1] What page should be queried
 * @return {promise} A promise returning the category array or an error
 */
const fetchCategoryPages = (page = 1, perPage = 10) =>
	fetchApi(
		"/wp-json/wp/v2/product_cat/?&page=" + page + "&per_page=" + perPage,
		{
			method: "GET"
		}
	).then(response => {
		return response.json().then(categories => {
			const totalItems = parseInt(response.headers.get("x-wp-total"));

			if ((page - 1) * perPage + categories.length < totalItems) {
				return fetchCategoryPages(page + 1).then(nextCategories =>
					Promise.resolve([...categories, ...nextCategories])
				);
			}

			return Promise.resolve(categories);
		});
	});

/**
 * Fetches product categories
 * @param {page} page Which page should be queried
 * @returns {function} A redux thunk
 */
export const fetch = () => dispatch => {
	dispatch(fetchProductCategories(true, null));

	return fetchCategoryPages()
		.then(categories => {
			dispatch(
				fetchProductCategories(
					false,
					null,
					categories.map(
						({
							id,
							count,
							description,
							name,
							slug,
							parent,
							thumbnail_id: thumbnailId
						}) => ({
							id,
							count,
							description,
							name,
							slug,
							parent,
							thumbnailId
						})
					)
				)
			);

			return Promise.resolve(categories);
		})
		.catch(error => {
			dispatch(fetchProductCategories(false, error, []));

			return Promise.reject(error);
		});
};
