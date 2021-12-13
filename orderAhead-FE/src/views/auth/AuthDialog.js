import React, { lazy } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    CModal,
    CModalBody
  } from '@coreui/react'

const EmailVerify = lazy(() => import('./EmailVerify'));
const ForgotPassword1 = lazy(() => import('./ForgotPassword1'));
const ForgotPassword2 = lazy(() => import('./ForgotPassword2'));

const AuthDialog = () => {
  const dispatch = useDispatch()

  const openEmailVerification = useSelector(state => state.openEmailVerification)
  const forgotPassword1 = useSelector(state => state.forgotPassword1)
  const forgotPassword2 = useSelector(state => state.forgotPassword2)

  const handleClose = () => {
    dispatch({type: 'set', openEmailVerification: false})
    dispatch({type: 'set', forgotPassword1: false})
    dispatch({type: 'set', forgotPassword2: false})
  };

  return (
    <CModal 
        show={openEmailVerification || forgotPassword1 || forgotPassword2} 
        onClose={handleClose}
        className="p-0 auth-modal m-auto justify-content-center"
        centered
        // size={forgotPassword1 || forgotPassword2 ? '' : 'sm' }
        style={{
          borderRadius: "50px",
          overflow: "hidden",
          maxWidth: '450px',
          margin: 'auto'
        }}
        >
        <CModalBody className="p-0">
          <>
            { openEmailVerification && <EmailVerify />}
            { forgotPassword1 && <ForgotPassword1 /> }
            { forgotPassword2 && <ForgotPassword2 /> }
          </>
        </CModalBody>
    </CModal>
  )
}

export default AuthDialog
