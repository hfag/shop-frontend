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
