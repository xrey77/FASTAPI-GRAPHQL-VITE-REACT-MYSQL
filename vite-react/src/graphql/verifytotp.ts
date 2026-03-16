import { gql } from '@apollo/client';

export const VERIFY_OTP = gql`
  mutation VerifyOtp($input: OtpInput!) {
    OtpResponse(input: $input) {
        message
        username
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

export interface OtpVerificationData {
  user: UserData;
}

export interface OtpVerificationVariables {
  input: {
    id: number;
    otp: string;
  }
}
