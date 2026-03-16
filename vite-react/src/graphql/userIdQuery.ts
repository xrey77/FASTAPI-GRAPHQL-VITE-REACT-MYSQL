import { gql } from '@apollo/client';


export const GETUSERID_QUERY = gql`
  query GetUserId($id: Int!) {
    user(id: $id) {    
      id
      firstname
      lastname
      email
      mobile
      userpic
      isactivated
      isblocked
      mailtoken
      userpic
      qrcodeurl
    }
  }
`;

export interface UserData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  username: string;
  isactivated: boolean;
  isblocked: boolean;
  mailtoken: string;
  userpic: string;
  qrcodeurl: string;
}

export interface GetUserIdData {
  user: UserData;
}

export interface GetUserIdVariables {
  id: number;
}
