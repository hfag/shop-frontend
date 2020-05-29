import { ASSET_FRAGMENT } from "./asset";

export const GET_ALL_PRODUCT_SLUGS = /* GraphQL */ `
  query {
    products {
      items {
        id
        slug
      }
    }
  }
`;

export const VARIANT_FRAGMENT = `
  id
  sku
  name
  featuredAsset{
    ${ASSET_FRAGMENT}
  }
  assets{
    ${ASSET_FRAGMENT}
  }
  price
  facetValues{
    name
    facet{
      name
    }
  }
  options{
    id
    code
    name
    groupId
  }
  customFields{
    minimumOrderQuantity
  }
  bulkDiscounts{
    quantity
    price
  }
`;

export const OPTION_GROUP_FRAGMENT = `
  id
  code
  name
  options{
    id
    code
    name
  }
`;

export const FULL_PRODUCT_FRAGMENT = `
  id
  slug
  name
  description
  featuredAsset {
    ${ASSET_FRAGMENT}
  }
  assets {
    ${ASSET_FRAGMENT}
  }
  customFields {
    seoDescription
    groupKey
  }
  variants{
    ${VARIANT_FRAGMENT}
  }
  optionGroups{
    ${OPTION_GROUP_FRAGMENT}
  }
  facetValues{
    name
    facet{
      name
    }
  }
  collections{
    id
    name
  }
  recommendations{
    recommendation{
      name
      slug
      variants {
        price
      }
      collections{
        id
        name
      }
      featuredAsset{
        ${ASSET_FRAGMENT}
      }
    }
    type
  }
`;

export const GET_PRODUCT = /* GraphQL */ `
  query Product($id: ID!) {
    product(id: $id) {
      ${FULL_PRODUCT_FRAGMENT}
    }
  }
`;
export const GET_PRODUCT_BY_SLUG = /* GraphQL */ `
  query ProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      ${FULL_PRODUCT_FRAGMENT}
    }
  }
`;
