export const GET_ALL_COLLECTIONS = /* GraphQL */ `
  query {
    collections {
      items {
        id
        name
        children {
          name
        }
      }
    }
  }
`;

export const GET_COLLECTION = /* GraphQL */ `
  query Collection($id: ID!) {
    collection(id: $id) {
      id
      name
      description
      position
      links {
        type
        name
        url
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
    }
  }
`;
