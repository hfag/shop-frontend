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
