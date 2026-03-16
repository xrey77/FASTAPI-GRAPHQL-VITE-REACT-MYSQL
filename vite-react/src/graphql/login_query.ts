import { gql } from '@apollo/client';

export const SIGNIN_MUTATION = gql`
  mutation LoginUser($input: LoginInput!) {  
    loginUser(input: $input) {
      message
      token
      user {
        id
        firstname
        lastname
        email
        mobile
        username
        isactivated
        isblocked
        mailtoken
        userpic
        qrcodeurl
      }
    }
  }
  `
export interface User {
  id: string;
  firstname: string;
  lastname: string;  
  email: string;
  mobile: string;
  username: string;
  isactivated: number;
  isblocked: number;
  mailtoken: number;
  userpic: string;
  qrcodeurl: string;
}

export interface LoginUserData {
  loginUser: User;
}

export interface LoginUserVariables {
  input: {
    username: string;
    password: string;
  };
}
