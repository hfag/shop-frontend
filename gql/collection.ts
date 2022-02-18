export const GET_COLLECTION_SLUGS = /* GraphQL */ `
  query GetCollections($options: CollectionListOptions) {
    collections(options: $options) {
      items {
        id
        slug
      }
      totalItems
    }
  }
`;

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
  links {
    id
    icon
    name
    url
  }
  breadcrumbs {
    id
    slug
    name
  }
  children {
    id
    slug
    name
    position
    parent {
      id
      name
    }
    featuredAsset {
      id
      name
      width
      height
      preview
    }
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
      preview
    }
    facetValues{
      id
    }
    variants {
      price
    }
    collections {
      name
    }
    customFields {
      groupKey
      ordering
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

export const ADMIN_COLLECTION_LINK_FRAGMENT = /* GraphQl */ `
    id
    slug
    links {
      ... on CollectionUrlLink {
        linkId
        linkUrlId
        collectionId
        icon
        order
        translations {
          id
          languageCode
          name
          url
        }
      }
      ... on CollectionAssetLink {
        linkId
        linkAssetId
        collectionId
        icon
        order
        languageCode
        asset{
          id
          name
          preview
        }
      }
      __typename
    }
`;

export const ADMIN_GET_COLLECTION_LINKS_BY_SLUG = /* GraphQL */ `
  query Collection($slug: String!) {
    collection(slug: $slug) {
      ${ADMIN_COLLECTION_LINK_FRAGMENT}
    }
  }
`;

export const ADMIN_UPDATE_COLLECTION_LINKS = /* GraphQL */ `
  mutation UpdateCollectionLinks(
    $collectionId: ID!,
    $urlsToCreate: [CreateCollectionLinkUrlInput!]!,
    $urlsToUpdate: [UpdateCollectionLinkUrlInput!]!,
    $assetsToCreate: [CreateCollectionLinkAssetInput!]!,
    $assetsToUpdate: [UpdateCollectionLinkAssetInput!]!,
    $toDelete: [ID!]!
  ) {
    updateCollectionLinks(
      collectionId: $collectionId,
      urlsToCreate: $urlsToCreate,
      urlsToUpdate: $urlsToUpdate,
      assetsToCreate: $assetsToCreate,
      assetsToUpdate: $assetsToUpdate,
      toDelete: $toDelete
    ) {
      ${ADMIN_COLLECTION_LINK_FRAGMENT}
    }
  }
`;
