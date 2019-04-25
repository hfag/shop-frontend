import { windowExists } from "./ssr";

/**
 * Gets the language from a given location object
 * @param {Object} location The location object
 * @param {string} fallback The fallback language
 * @returns {string} The language
 */
export const getLanguageFromLocation = (location, fallback = "de") => {
  return (location.pathname && location.pathname.split("/")[1]) || fallback;
};

/**
 * Gets the language from the current window or returns the fllback language if we are
 * server side rendering.
 * @param {string} fallback The fallback language
 * @returns {string} The language
 */
export const getLanguageFromCurrentWindow = (fallback = "de") => {
  return windowExists() ? getLanguageFromLocation(window.location) : fallback;
};

export const supportedLanguages = ["de", "fr"];

/**
 * Checks whether a given language is supported
 * @param {string} language The language to check
 * @returns {boolean} Whether it is supported
 */
export const isLanguageSupported = language =>
  supportedLanguages.indexOf(language) !== -1;
