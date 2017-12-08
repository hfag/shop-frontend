import { API_URL } from "config.json";

export const fetchApi = (url, options) =>
	fetch(API_URL + url, options).then(response => {
		if (!response.ok) {
			return Promise.reject(
				new Error(response.status + " " + response.statusText)
			);
		}
		return Promise.resolve(response);
	});
