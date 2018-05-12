/**
 * Loads the previously stored state from localStorage
 * @returns {Object|undefined} The loaded state
 */
export const loadState = () => {
	try {
		const serializedState = localStorage.getItem("state");
		if (serializedState === null) {
			return undefined;
		}

		return JSON.parse(serializedState);
	} catch (err) {
		return undefined;
	}
};

/**
 * Stores the current redux state in the localStorage
 * @param {Object} state The current state object
 * @returns {void}
 */
export const saveState = state => {
	try {
		const serializedState = JSON.stringify(state);

		localStorage.setItem("state", serializedState);
	} catch (err) {
		throw err;
	}
};
