import React, { lazy, useState, useEffect } from 'react'
import {
  CCard,
  CButton,
  CCardBody
} from '@coreui/react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { userService } from '../../controllers/_services';
import { successNotification, warningNotification } from '../../controllers/_helpers';

const TFAVerification = () => {
    const dispatch = useDispatch()
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [mfa, setMfa] = useState()

    const user = useSelector(state => state.user)
 
    useEffect(() => {
        if (localStorage.getItem('userId') && user) {
            setMfa(user.mfa)
        }
    }, [user]);
  
  const onSubmit = (info) => {
      if (user) {
          const newUser = {
              ...user,
              "mfa": info
          }
          setIsSubmitting(true)
          userService.updateMfa(newUser).then(
              result => {
                  dispatch({type: 'set', user: newUser})
                  successNotification("Updated your profile successfully", 3000)
                  setIsSubmitting(false)
              },
              error => {
                  warningNotification(error, 3000)
                  setIsSubmitting(false)
              }
          )
      }
  }
  // render
  return (

    <CCard color="transparent" className="d-box-shadow1 d-border" style={{height: "222.5px"}}>
        <CCardBody className="card-setting m-0" style={{height: "222.5px"}}>

            <div className="d-flex mt-3">
                <h5>
                    With 2-step verification, you protect your account with both your email and your phone.
                </h5>
            </div>
            
            <div className="d-flex mt-3 float-right">
                <CButton className="button-exchange" onClick={() => { 
                        if (mfa === 'email' )
                        {
                            setMfa('phone');
                            onSubmit('phone');
                        }
                        else {
                            setMfa('email');
                            onSubmit('email');
                        }
                     }} disabled={isSubmitting}>
                    {mfa === 'email' ? 'Disable' : 'Enable'} for MFA Email
                </CButton>
                { user && user.phone_number && 
                    <CButton className="button-exchange" onClick={() => { 
                        if (mfa === 'email' )
                        {
                            setMfa('phone');
                            onSubmit('phone');
                        }
                        else {
                            setMfa('email');
                            onSubmit('email');
                        }    
                    }} disabled={isSubmitting} style={{marginLeft: '30px'}}>
                        {mfa === 'phone' ? 'Disable' : 'Enable'} for MFA Phone
                    </CButton>
                }
            </div>

        </CCardBody>
    </CCard>

    )
}

export default TFAVerification
