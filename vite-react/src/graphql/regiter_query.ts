import { gql } from '@apollo/client';

export const SIGNUP_MUTATION = gql`
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        message
      }
    }
  `
interface User {
  id: string;
  firstname: string;
  lastname: string;  
  email: string;
  mobile: string;
  username: string;
  password: string;
}

export interface CreateUserData {
  createUser: User;
}

export interface CreateUserVariables {
  input: {
    firstname: string;
    lastname: string;    
    email: string;
    mobile: string;
    username: string;
    password: string;
  };
}
