export const GET_CURRENT_USER = /* GraphQL */ `
  query {
    me {
      identifier
      channels {
        id
        code
        permissions
      }
    }
  }
`;

export const GET_CURRENT_CUSTOMER = /* GraphQL */ `
  query {
    activeCustomer {
      id
      title
      firstName
      lastName
      phoneNumber
      emailAddress
    }
  }
`;
