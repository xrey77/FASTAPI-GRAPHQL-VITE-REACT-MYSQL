import { useState, useEffect } from "react";
import jQuery from 'jquery';
import { useMutation as useApolloMutation } from '@apollo/client/react';
import { useLazyQuery } from '@apollo/client/react';

import { GETUSERID_QUERY } from '../graphql/userIdQuery'; 
import type { GetUserIdData, GetUserIdVariables } from '../graphql/userIdQuery';

import { UPDATE_PROFILE } from '../graphql/updateProfileMutation';
import type { ProfiledData, ProfileVariables } from '../graphql/updateProfileMutation';

import { CHANGE_PASSWORD } from "../graphql/changePassword";
import type { PasswordData, PasswordVariables } from "../graphql/changePassword";

import { ACTIVATE_MFA } from "../graphql/mfaactivate";
import type { MfaActivationData, MfaActivationVariables } from "../graphql/mfaactivate";

import { UPLOAD_PICTURE } from "../graphql/uploadpicture";
import type { UploadData, UploadVariables } from "../graphql/uploadpicture";

export default function Profile() {    
    const [userid, setUserid] = useState<number>(0);;
    const [lname, setLname] = useState<string>('');
    const [fname, setFname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [mobile, setMobile] = useState<string>('');
    const [userpicture, setUserpicture] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [newpassword, setNewPassword ] = useState<string>('');
    const [confnewpassword, setConfNewPassword ] = useState<string>('');    
    const [profileMsg, setProfileMsg] = useState<string>('');
    const [showmfa, setShowMfa] = useState<boolean>(false);
    const [showpwd, setShowPwd] = useState<boolean>(false);
    const [showupdate, setShowUpdate] = useState<boolean>(false);
    const [qrcodeurl, setQrcodeurl] = useState<string>('');    

    const [getUser] = useLazyQuery<GetUserIdData, GetUserIdVariables>(GETUSERID_QUERY);

    const fetchUserData = async (idno: number, _tokenid: any) => {
        
        try {
            const { data } = await getUser({ 
                variables: { id: idno }
                // context: {
                //     headers: {
                //         Authorization: `Bearer ${tokenid}`,
                //     },
                // },
            });
            if (data?.user) {
                setLname(data.user.lastname);
                setFname(data.user.firstname);
                setEmail(data.user.email);
                setMobile(data.user.mobile);
                setUserpicture(`/static/users/${data.user.userpic}`);
                setQrcodeurl(data.user.qrcodeurl ?? '/static/images/qrcode.png');
            }            
            return;
        } catch (err: any) {
            if (err.AbortError) {
                setProfileMsg(err.message);
            }
            setTimeout(() => { setProfileMsg('');  }, 1000);
        }
    };    

    useEffect(() => {
        jQuery("#password").prop('disabled', true);

        const userId = sessionStorage.getItem('USERID') ?? '';
        let idno: number = parseInt(userId);
        setUserid(idno)

        const xtoken = sessionStorage.getItem('TOKEN') ?? '';
        setToken(xtoken);

        setProfileMsg('please wait..');
        fetchUserData(idno, xtoken);    

    },[userid, token]) 


    const [updateProfile] = useApolloMutation<ProfiledData, ProfileVariables>(UPDATE_PROFILE, {
        onCompleted: (data: any) => {
            setProfileMsg(data.updateProfile.message);
            setTimeout(() => { setProfileMsg(''); }, 3000);
        },
        onError: (err: any) => {
            setProfileMsg(err.message);
            setTimeout(() => { setProfileMsg(''); }, 3000);
        }
    });

    const submitProfile = async (event: React.SubmitEvent) => {
        event.preventDefault();
        try {
            await updateProfile({
                variables: {input: { id: userid, firstname: fname, lastname: lname, mobile: mobile }
                }
                // context: {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                // },
            });
        } catch (err: any) {
            setTimeout(() => { setProfileMsg(''); }, 3000);
        }
    }

    const [UploadResponse] = useApolloMutation<UploadData, UploadVariables>(UPLOAD_PICTURE, {
        onCompleted: (data: any) => {
            setProfileMsg(data.UploadResponse.message);
            setTimeout(() => { 
                setProfileMsg(''); 
                let userpic: string = `/static/users/${data.upload_picture.userpic}`;
                setUserpicture(userpic);
                sessionStorage.setItem('USERPIC',userpic);
                window.location.reload();
            }, 3000);
        },
        onError: (err: any) => {
            setProfileMsg(err.message);
            setTimeout(() => { setProfileMsg(''); }, 3000);
        }
    });

  const changePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        var pix = URL.createObjectURL(file);
        jQuery('#userpic').attr('src', pix)

        await UploadResponse({
            variables: {
                input: {
                    id: userid,
                    file: file, 
                },
            },
            context: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        });
    }
  };

    const cpwdCheckbox = (e: any) => {
        if (e.target.checked) {
            setShowUpdate(true);
            setShowPwd(true);
            setShowMfa(false);
            jQuery('#checkTwoFactor').prop('checked', false);
            return;
        } else {
            setNewPassword('');
            setConfNewPassword('');
            setShowPwd(false);
            setShowUpdate(false)
        }
    }

    const mfaCheckbox = (e: any) => {
        if (e.target.checked) {
            setShowMfa(true);
            setShowUpdate(true)
            setShowPwd(false);
            jQuery('#checkChangePassword').prop('checked', false);
        } else {
            setShowMfa(false);
            setShowUpdate(false)
        }
    }

    const [MfaActivationResponse] = useApolloMutation<MfaActivationData, MfaActivationVariables>(ACTIVATE_MFA, {
        onCompleted: (data: any) => {
            setProfileMsg(data.MfaActivationResponse.message);
            if (data.MfaActivationResponse.qrcodeurl === null) {
                setQrcodeurl("/static/images/qrcode.png");
            } else {
                setQrcodeurl(data.MfaActivationResponse.qrcodeurl);
            }
            setTimeout(() => { setProfileMsg(''); }, 3000);
        },
        onError: (err: any) => {
            setProfileMsg(err.message);
            setTimeout(() => { setProfileMsg(''); }, 3000);
        }
    });


    const enableMFA = async () => {
        try {
            await MfaActivationResponse({
                variables: {
                    input: { id: userid, twofactorenabled: true }
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            });
        } catch (err: any) {
            setTimeout(() => { setProfileMsg(''); }, 3000);
        }
    }

    const disableMFA = async () => {
        try {
            await MfaActivationResponse({
                variables: {
                    input: { id: userid, twofactorenabled: false }
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            });
        } catch (err: any) {
            alert("error 2");
            setTimeout(() => { setProfileMsg(''); }, 3000);
        }

    }

    const [UpdatePasswordResponse] = useApolloMutation<PasswordData, PasswordVariables>(CHANGE_PASSWORD, {
        onCompleted: (data: any) => {
            setProfileMsg(data.UpdatePasswordResponse.message);
            setTimeout(() => { setProfileMsg(''); }, 3000);
        },
        onError: (err: any) => {
            setProfileMsg(err.message);
            setTimeout(() => { setProfileMsg(''); }, 3000);
        }
    });

    const changePassword = async (event: any) => {
        event.preventDefault();
        if (newpassword === '') {
            setProfileMsg("Please enter new Pasword.");
            setTimeout(() => {
                setProfileMsg('');
            },3000);
            return;
        }
        if (confnewpassword === '') {
            setProfileMsg("Please enter new Pasword confirmation.");
            setTimeout(() => {
                setProfileMsg('');
            },3000);
            return;            
        }

        if (newpassword !== confnewpassword) {
            setProfileMsg("new Password does not matched.");
            setTimeout(() => {
                setProfileMsg('');
            },3000);
            return;            
        }

        try {
            await UpdatePasswordResponse({
                variables: {
                    input: { id: userid,  password: newpassword }
                }
                // context: {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                // },
            });
        } catch (err: any) {
            setTimeout(() => { setProfileMsg(''); }, 3000);
        }
    }

    return (
      <div className='profile-bg'>
        <div className="card card-profile mt-3">
        <div className="card-header bg-primary">
            <h3 className="text-white">User Profile ID No. {userid}</h3>
        </div>
        <div className="card-body">
        <form onSubmit={submitProfile} encType="multipart/form-data" autoComplete='false'>
                <div className='row'>
                    <div className='col'>
                        <input className="form-control bg-warning text-dark border-primary" id="firstname" name="firstname" type="text" value={fname} onChange={e => setFname(e.target.value)} required  />
                        <input className="form-control bg-warning text-dark border-primary mt-2" id="lastname" name="lastname" type="text" value={lname} onChange={e => setLname(e.target.value )} required />
                    </div>
                    <div className='col text-right'>

                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <input className="form-control bg-warning border-primary mt-2" id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} readOnly />
                    </div>
                    <div className='col'>
                        {
                            userpicture == null ? (
                                <img id="userpic" className="userpic" alt="" />
                            )
                            :
                            <img id="userpic" src={userpicture} className="userpic" alt="" />
                        }
                    </div>
                </div>


                <div className='row'>
                    <div className='col'>
                            <input className="form-control bg-warning border-primary mt-2" id="mobileno" name="mobileno" type="text" value={mobile} onChange={e => setMobile(e.target.value)} required />
                    </div>
                    <div className='col'>
                        <input className="userpicture mt-2" onChange={changePicture} type="file"/>
                    </div>
                </div>

                <div className='row'>
                    {/* 2-FACTOR AUTHENTICATION */}
                    <div className='col'>
                            <div className="form-check mt-2">
                                <input onChange={mfaCheckbox} className="form-check-input chkbox" type="checkbox" id="checkTwoFactor"/>
                                <label className="form-check-label" htmlFor="checkTwoFactor">
                                    Enable 2-Factor Authentication
                                </label>
                            </div>
                            {
                                showmfa === true ? (
                                    <div className='row'>
                                        <div className='col-5'>
                                            <img id="googleAuth" src={qrcodeurl} className="qrCode2" alt="QRCODE" />
                                        </div>
                                        <div className='col-7 qrcode-ml'>
                                            <p className='text-danger mfa-pos-1'><strong>Requirements</strong></p>
                                            <p className="mfa-pos-2">You need to install <strong>Google or Microsoft Authenticator</strong> in your Mobile Phone, once installed, click Enable Button below, and <strong>SCAN QR CODE</strong>, next time you login, another dialog window will appear, then enter the <strong>OTP CODE</strong> from your Mobile Phone in order for you to login.</p>
                                            <button onClick={enableMFA} type="button" className='btn btn-primary mfa-btn-1 mx-1'>enable</button>
                                            <button onClick={disableMFA} type="button" className='btn btn-secondary mfa-btn-2'>disable</button>
                                        </div>
                                    </div>
                                )
                                :
                                null
                            }

                    </div>
                    <div className='col'>
                            {/* CHANGE PASSWORD */}
                            <div className="form-check mt-2">
                            <input onChange={cpwdCheckbox} className="form-check-input chkbox" type="checkbox" id="checkChangePassword"/>
                            <label className="form-check-label" htmlFor="checkChangePassword">
                                Change Password
                            </label>
                        </div>
                        { showpwd === true ? (
                            <>
                              <input className="form-control text-dark border-primary mt-2" type="password" id="newPassword" value={newpassword} onChange={e => setNewPassword(e.target.value)} autoComplete="off" placeholder='enter new Password'/>
                              <input className="form-control text-dark border-primary mt-1" type="password" id="confNewPassword" value={confnewpassword} onChange={e => setConfNewPassword(e.target.value)} autoComplete="off" placeholder='confirm new Password'/>
                              <button onClick={changePassword} className='btn btn-primary mt-2' type="button">change password</button>
                            </>
                        )
                        :
                            null
                        }

                    </div>
                </div> 
                {
                    showupdate === false ? (
                        <button type='submit' className='btn btn-primary text-white mt-2'>update profile</button>
                    )
                    :
                    null
                }
                </form>
        </div>
        <div className="card-footer text-danger">
            {profileMsg}
        </div>
        </div>
    </div>    
  )
}
