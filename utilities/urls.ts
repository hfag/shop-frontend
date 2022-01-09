import {
  Language,
  getLanguageFromCurrentWindow,
  getLanguageFromLocation,
} from "./i18n";

import pages from "./pages.json";
import pathnames from "./pathnames.json";

export const pathnamesByLanguage = pathnames;
export const pageSlugsByLanguage = pages;

/**
 * Gets the url part by a key and the given location language
 */
export const getUrlPartByKeyAndLocation = (
  urlKey: string,
  location: Location,
  fallback = "de"
) => pathnamesByLanguage[getLanguageFromLocation(location, fallback)][urlKey];

/**
 * Gets the url part by a key and the current window lanuage
 */
export const getUrlPartByKeyForCurrentLanguage = (
  urlKey: string,
  fallback: Language
) => pathnamesByLanguage[getLanguageFromCurrentWindow(fallback)][urlKey];
