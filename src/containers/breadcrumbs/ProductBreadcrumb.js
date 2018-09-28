import { getProductCategoryById, getProductBySlug } from "reducers";

/**
 * Generates the breadcrumb array for a product
 * @param {Object} match The react router match object
 * @param {Object} location The react router location object
 * @param {Object} state The redux state
 * @returns {Array} The breadcrumb array
 */
export const generateProductBreadcrumbs = (
  { params: { productSlug } },
  location,
  state
) => {
  const product = getProductBySlug(state, productSlug) || {};

  const category =
    getProductCategoryById(
      state,
      product.categoryIds ? product.categoryIds[0] : -1
    ) || {};
  const parents =
    product.categoryIds && getProductCategoryById(state, product.categoryIds[0])
      ? [getProductCategoryById(state, product.categoryIds[0])]
      : [];

  let current = category;

  while (current.parent) {
    parents.push(getProductCategoryById(state, current.parent));
    current = parents[parents.length - 1];
  }

  const reversedParents = parents.reverse();

  return [
    ...reversedParents.map((category, index) => ({
      url:
        "/produkt-kategorie/" +
        (index > 0
          ? reversedParents
              .slice(0, index)
              .map(category => category.slug)
              .join("/") + "/"
          : "") +
        category.slug +
        "/1",
      name: category.name
    })),
    { url: "/produkt/" + productSlug, name: product.title }
  ];
};
