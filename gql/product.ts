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

export const GET_PRODUCTS = /* GraphQL */ `
  query GetProducts($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
        name
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
    id
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
    source
  }
  customFields {
    groupKey
    customizationOptions
  }
  variants{
    ${VARIANT_FRAGMENT}
  }
  optionGroups{
    ${OPTION_GROUP_FRAGMENT}
  }
  facetValues{
    id
    name
    facet{
      name
      code
    }
  }
  collections{
    id
    name
    breadcrumbs{
      id
      slug
      name
    }
  }
  recommendations{
    recommendation{
      id
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

export const ADMIN_UPDATE_CROSS_SELLS = /* GraphQL */ `
  mutation UpdateCrossSellingProducts($productId: ID!, $productIds: [ID!]!) {
    updateCrossSellingProducts(productId: $productId, productIds: $productIds)
  }
`;

export const ADMIN_UPDATE_UP_SELLS = /* GraphQL */ `
  mutation UpdateUpSellingProducts($productId: ID!, $productIds: [ID!]!) {
    updateUpSellingProducts(productId: $productId, productIds: $productIds)
  }
`;

export const ADMIN_UPDATE_BULK_DISCOUNTS = /* GraphQL */ `
  mutation UpdateBulkDiscounts($updates: [BulkDiscountUpdate!]!) {
    updateBulkDiscounts(updates: $updates)
  }
`;
