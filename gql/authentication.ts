import { CURRENT_USER_FRAGMENT } from "./user";

export const REQUEST_PASSWORD_RESET = /* GraphQL */ `
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(emailAddress: $email) {
      ... on Success {
        success
      }
      ... on NativeAuthStrategyError {
        errorCode
        message
      }
    }
  }
`;

export const LOGIN = /* GraphQL */ `
  mutation login($email: String!, $password: String!) {
    authenticate(input: {legacy: {email: $email, password: $password}}){
      ... on CurrentUser {
        ${CURRENT_USER_FRAGMENT}
      }

      ... on InvalidCredentialsError {
        errorCode
        message
        authenticationError
      }

      ... on NotVerifiedError {
        errorCode
        message
      }
    }
  }
`;

export const REGISTER = /* GraphQL */ `
  mutation register($email: String!) {
    registerCustomerAccount(input: { emailAddress: $email }) {
      ... on Success {
        success
      }
      ... on MissingPasswordError {
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

export const VERIFY_ACCOUNT = /* GraphQL */ `
  mutation VerifyCustomerAccount($token: String!, $password: String!) {
    verifyCustomerAccount(token: $token, password: $password){
        ... on CurrentUser {
          ${CURRENT_USER_FRAGMENT}
        }
        ... on VerificationTokenInvalidError {
          errorCode
          message
        }
        ... on VerificationTokenExpiredError {
          errorCode
          message
        }
        ... on MissingPasswordError {
          errorCode
          message
        }
        ... on PasswordAlreadySetError {
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
