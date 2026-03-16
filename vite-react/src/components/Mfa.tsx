import { useState } from "react"
import jQuery from "jquery";
import { VERIFY_OTP } from "../graphql/verifytotp";
import type { OtpVerificationData, OtpVerificationVariables } from "../graphql/verifytotp";
import { useMutation as useApolloMutation } from '@apollo/client/react';

export default function Mfa() {
  const [otp, setOtp] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [OtpResponse] = useApolloMutation<OtpVerificationData, OtpVerificationVariables>(VERIFY_OTP, {
      onCompleted: (data: any) => {
          setMessage(data.OtpResponse.message);
          sessionStorage.setItem("USERNAME", data.OtpResponse.username);            
          window.setTimeout(() => {
            setMessage('');
            jQuery("#mfaReset").trigger('click');
            window.location.reload();
          }, 3000);
      },
      onError: (err: any) => {
          setMessage(err.message);
          setTimeout(() => { setMessage(''); }, 3000);
      }
  });


  const submitMfa = async (event: React.SubmitEvent) => {
    event.preventDefault();

    const userid = sessionStorage.getItem('USERID') ?? '';
    const token = sessionStorage.getItem('TOKEN') ?? '';
    setMessage('please wait..');

    try {
        await OtpResponse({
            variables: {
                input: { 
                  id: parseInt(userid), otp: otp },
            },
            context: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        });
    } catch (err: any) {
        setMessage(err.message);
        setTimeout(() => { setMessage(''); }, 3000);
    }
  }

  const closeMfa = (event: any) => {
    event.preventDefault();
    setMessage('');
    setOtp('');
    sessionStorage.removeItem('USERID');
    sessionStorage.removeItem('USERNAME');
    sessionStorage.removeItem('USERPIC');
    sessionStorage.removeItem('TOKEN');
    location.reload();
  }

  return (
    <div className="modal fade" id="staticMfa" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticMfaLabel" aria-hidden="true">
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-info">
            <div className="modal-title fs-5 text-dark" id="staticMfaLabel">Multi-Factor Authenticator</div>
            <button onClick={closeMfa} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
          <form onSubmit={submitMfa} autoComplete="off">
            <div className="mb-3">
              <input type="text" required value={otp} onChange={e => setOtp(e.target.value)} className="form-control border-dark" id="otp" placeholder="enter 6-digin OTP code"/>
            </div>          
            <div className="mb-3">
              <button type="submit" className="btn btn-info mx-2 text-dark">submit</button>
              <button type="reset" className="btn btn-info text-dark">reset</button>
            </div>
          </form>            
          </div>
          <div className="modal-footer">
            <div className="w-100 text-center text-danger">{message}</div>
          </div>
        </div>
      </div>
    </div>    
  )
}
        
