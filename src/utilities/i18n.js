import { windowExists } from "./ssr";

export const supportedLanguages = ["de", "fr"];

export const DEFAULT_LANGUAGE = "de";

/**
 * Checks whether a given language is supported
 * @param {string} language The language to check
 * @returns {boolean} Whether it is supported
 */
export const isLanguageSupported = language =>
  supportedLanguages.indexOf(language) !== -1;

/**
 * Returns the given language if it is supported.
 * Otherweise return the given fallback language
 * @param {string} language The language to filter
 * @param {string} [fallback] The fallback language
 * @returns {string} The language that should be used
 */
export const filterLanguage = (language, fallback = DEFAULT_LANGUAGE) =>
  isLanguageSupported(language) ? language : fallback;

/**
 * Gets the language from a given location object
 * @param {Object} location The location object
 * @param {string} [fallback] The fallback language
 * @returns {string} The language
 */
export const getLanguageFromLocation = (
  location,
  fallback = DEFAULT_LANGUAGE
) => {
  return filterLanguage(
    location.pathname && location.pathname.split("/")[1],
    fallback
  );
};

/**
 * Gets the language from a given pathname
 * @param {string} pathname The pathname
 * @param {string} [fallback] The fallback language
 * @returns {string} The language
 */
export const getLanguageFromPathname = (
  pathname,
  fallback = DEFAULT_LANGUAGE
) => {
  return filterLanguage(pathname.split("/")[1], fallback);
};

/**
 * Gets the language from the current window or returns the fllback language if we are
 * server side rendering.
 * @param {string} [fallback] The fallback language
 * @returns {string} The language
 */
export const getLanguageFromCurrentWindow = (fallback = DEFAULT_LANGUAGE) => {
  return windowExists() ? getLanguageFromLocation(window.location) : fallback;
};
