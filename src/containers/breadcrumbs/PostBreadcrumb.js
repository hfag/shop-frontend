import { getPostBySlug } from "../../reducers";

/**
 * Generates the breadcrumb array for a category
 * @param {Object} match The react router match object
 * @param {Object} location The react router location object
 * @param {Object} state The redux state
 * @returns {Array} The breadcrumb array
 */
export const generatePostBreadcrumbs = (
  { params: { postSlug } },
  location,
  state
) => {
  const post = getPostBySlug(state, postSlug) || {};
  return {
    url: `/beitrag/${post.slug}`,
    name: post.title
  };
};
