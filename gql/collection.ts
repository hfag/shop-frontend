export const GET_ALL_COLLECTIONS = /* GraphQL */ `
  query {
    collections {
      items {
        id
        slug
        name
        children {
          id
          name
          slug
        }
      }
    }
  }
`;

export const FULL_COLLECTION_FRAGMENT = /* Graphql */ `
  id
  slug
  name
  description
  position
  links {
    icon
    name
    url
  }
  breadcrumbs {
    id
    slug
    name
  }
  featuredAsset {
    id
    name
    width
    height
    source
  }
  customFields {
    seoDescription
  }
  parent {
    id
    name
  }
  children {
    id
    slug
    name
  }
  products {
    id
    name
    slug
    featuredAsset {
      id
      name
      width
      height
      source
    }
    variants {
      price
    }
    collections {
      name
    }
  }
`;

export const GET_COLLECTION_BY_SLUG = /* GraphQL */ `
  query Collection($slug: String!) {
    collection(slug: $slug) {
      ${FULL_COLLECTION_FRAGMENT}
    }
  }
`;

export const GET_COLLECTION_BY_ID = /* GraphQL */ `
  query Collection($id: ID!) {
    collection(id: $id) {
      ${FULL_COLLECTION_FRAGMENT}
    }
  }
`;
