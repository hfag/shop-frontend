import { FULL_ADDRESS_FRAGMENT } from "./order";

export const CURRENT_USER_FRAGMENT = `
  identifier
  channels {
    id
    code
    permissions
  }
`;

export const ACTIVE_CUSTOMER_FRAGMENT = `
  id
  title
  firstName
  lastName
  phoneNumber
  emailAddress
  addresses {
    ${FULL_ADDRESS_FRAGMENT}
  }
  resellerDiscounts {
    facetValueIds
    discount
  }
`;

export const GET_CURRENT_USER = /* GraphQL */ `
  query {
    me {
      ${CURRENT_USER_FRAGMENT}
    }
    activeCustomer {
      ${ACTIVE_CUSTOMER_FRAGMENT}
    }
  }
`;

export const GET_CURRENT_CUSTOMER = /* GraphQL */ `
  query {
    activeCustomer {
      ${ACTIVE_CUSTOMER_FRAGMENT}
    }
  }
`;

export const GET_CURRENT_CUSTOMER_ORDERS = /* GraphQL */ `
  query activeCustomerOrders($skip: Int!, $take: Int!) {
    activeCustomer {
      orders(options: { skip: $skip, take: $take, sort: { updatedAt: DESC } }) {
        items {
          id
          code
          updatedAt
          total
          state
          lines {
            quantity
          }
        }
        totalItems
      }
    }
  }
`;

export const GET_CURRENT_CUSTOMER_ALL_ORDERS = /* GraphQL */ `
  query activeCustomerOrders {
    activeCustomer {
      orders(options: { sort: { updatedAt: DESC }, take: 10 }) {
        items {
          id
          code
          updatedAt
          total
        }
        totalItems
      }
    }
  }
`;

export const UPDATE_CUSTOMER = /* GraphQL */ `
  mutation UpdateCustomer($input: UpdateCustomerInput!){
    updateCustomer(input: $input){
      ${ACTIVE_CUSTOMER_FRAGMENT}
    }
  }
`;
export const UPDATE_CUSTOMER_PASSWORD = /* GraphQL */ `
  mutation UpdateCustomerPassword($password: String!, $newPassword: String!) {
    updateCustomerPassword(
      currentPassword: $password
      newPassword: $newPassword
    )
  }
`;
export const REQUEST_UPDATE_CUSTOMER_EMAIL = /* GraphQL */ `
  mutation RequestUpdateCustomerEmailAddress(
    $currentPassword: String!
    $email: String!
  ) {
    requestUpdateCustomerEmailAddress(
      password: $currentPassword
      newEmailAddress: $email
    ) {
      ... on Success {
        success
      }
      ... on InvalidCredentialsError {
        errorCode
        message
      }
      ... on EmailAddressConflictError {
        errorCode
        message
      }
      ... on NativeAuthStrategyError {
        errorCode
        message
      }
    }
  }
`;
export const UPDATE_CUSTOMER_EMAIL = /* GraphQL */ `
  mutation UpdateCustomerEmailAddress($token: String!) {
    updateCustomerEmailAddress(token: $token) {
      ... on Success {
        success
      }
      ... on IdentifierChangeTokenInvalidError {
        errorCode
        message
      }
      ... on IdentifierChangeTokenExpiredError {
        errorCode
        message
      }
      ... on NativeAuthStrategyError {
        errorCode
        message
      }
    }
  }
`;

export const CREATE_CUSTOMER_ADDRESS = /* GraphQL */ `
  mutation CreateCustomerAddress($input: CreateAddressInput!) {
    createCustomerAddress(input: $input) {
      id
    }
  }
`;

export const UPDATE_CUSTOMER_ADDRESS = /* GraphQL */ `
  mutation UpdateCustomerAddress($input: UpdateAddressInput!) {
    updateCustomerAddress(input: $input) {
      id
    }
  }
`;

export const DELETE_CUSTOMER_ADDRESS = /* GraphQL */ `
  mutation DeleteCustomerAddress($id: ID!) {
    deleteCustomerAddress(id: $id) {
      ... on Success {
        success
      }
    }
  }
`;
export const RESET_PASSWORD = /* GraphQL */ `
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      ... on CurrentUser {
        id
      }
      ... on PasswordResetTokenInvalidError {
        errorCode
        message
      }
      ... on PasswordResetTokenExpiredError {
        errorCode
        message
      }
      ... on NativeAuthStrategyError {
        errorCode
        message
      }
      ... on PasswordValidationError {
        errorCode
        message
      }
      ... on NotVerifiedError {
        errorCode
        message
      }
    }
  }
`;

export const LOGOUT = /* GraphQL */ `
  mutation logout {
    logout {
      ... on Success {
        success
      }
    }
  }
`;
