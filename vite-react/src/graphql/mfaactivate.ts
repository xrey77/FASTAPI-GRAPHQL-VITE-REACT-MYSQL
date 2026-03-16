import { gql } from '@apollo/client';

export const ACTIVATE_MFA = gql`
  mutation MfaActivation($input: MfaActivationInput!) {
    MfaActivationResponse(input: $input) {
        message
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

export interface MfaActivationData {
  user: UserData;
}

export interface MfaActivationVariables {
  input: {
    id: number;
    twofactorenabled: boolean;
  }
}
