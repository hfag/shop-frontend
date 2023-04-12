export const SEARCH = /* GraphQL */ `
  query Search($input: SearchInput!) {
    search(input: $input) {
      items {
        sku
        slug
        productName
        productAsset {
          preview
        }
        productVariantId
        productVariantName
        productVariantAsset {
          preview
        }
        price {
          ... on PriceRange {
            min
            max
          }
          ... on SinglePrice {
            value
          }
        }
        currencyCode
        score
        facetValueIds
      }
      totalItems
      facetValues {
        facetValue {
          facet {
            name
          }
          name
        }
        count
      }
    }
  }
`;

export const GET_PRODUCTS_BY_FACETS_IDS = /* GraphQL */ `
  query GetProductsByFacetIds($facetValueIds: [ID!]!, $take: Int, $skip: Int) {
    search(
      input: {
        facetValueIds: $facetValueIds
        take: $take
        skip: $skip
        sort: { name: ASC }
        groupByProduct: false
      }
    ) {
      items {
        sku
        productVariantName
        slug
        price {
          ... on SinglePrice {
            value
          }
        }
        facetValueIds
      }
      totalItems
    }
  }
`;
