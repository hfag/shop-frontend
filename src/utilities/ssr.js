/**
 * Checks if the global window object exists, i.e. whether we are in a browser
 * @returns {boolean} Whether the window exists
 */
export const windowExists = () => typeof window !== "undefined";
