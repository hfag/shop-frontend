import { CURRENT_USER_FRAGMENT } from "./user";

export const REQUEST_PASSWORD_RESET = /* GraphQL */ `
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(emailAddress: $email)
  }
`;

export const LOGIN = /* GraphQL */ `
  mutation login($email: String!, $password: String!) {
    login(username: $email, password: $password){
        user {
            ${CURRENT_USER_FRAGMENT}
        }
    }
  }
`;

export const REGISTER = /* GraphQL */ `
  mutation register($email: String!) {
    registerCustomerAccount(input: { emailAddress: $email })
  }
`;

export const VERIFY_ACCOUNT = /* GraphQL */ `
  mutation VerifyCustomerAccount($token: String!, $password: String!) {
    verifyCustomerAccount(token: $token, password: $password){
        user{
            ${CURRENT_USER_FRAGMENT}
        }
    }
  }
`;
