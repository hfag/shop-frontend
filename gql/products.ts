import gql from "graphql-tag";

export const GET_ALL_COLLECTIONS = gql`
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
