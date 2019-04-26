import { getPageBySlug, getLanguage } from "../../reducers";
import { pathnamesByLanguage } from "../../utilities/urls";

/**
 * Generates the breadcrumb array for a category
 * @param {Object} match The react router match object
 * @param {Object} location The react router location object
 * @param {Object} state The redux state
 * @returns {Array} The breadcrumb array
 */
export const generatePageBreadcrumbs = (
  { params: { pageSlug } },
  location,
  state
) => {
  const page = getPageBySlug(state, pageSlug) || {};
  const language = getLanguage(state);

  return {
    url: `/${language}/${pathnamesByLanguage[language].page}/${page.slug}`,
    name: page.title
  };
};
