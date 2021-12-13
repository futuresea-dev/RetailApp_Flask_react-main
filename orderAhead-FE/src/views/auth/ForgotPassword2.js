import React, { useState, useEffect } from 'react'
import {
  CWidgetSimple,
  CButton,
  CImg
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux';
import { userService } from '../../controllers/_services/user.service';
import { successNotification, warningNotification } from '../../controllers/_helpers';
import TextField from '@material-ui/core/TextField';
import {
    alpha,
    makeStyles,
  } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { InputAdornment } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  noBorder: {
    border: "none",
    boxShadow: `${alpha("#E3EFFE", 0.9)} 3px 3px 1px 1px`,
    borderRadius: '50px'
  },
}));
const useStylesReddit = makeStyles((theme) => ({
  root: {
    border: "1px solid lightgray",
    overflow: 'hidden',
    backgroundColor: '#fcfcfb',
    fontWeight: '400',
    lineHeight: '18px',
    fontSize: '18px',
    height: '55px',
    color: "black",
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: '#fff',
    },
    '&$focused': {
      backgroundColor: '#fff',
      boxShadow: `${alpha("#24242f", 0.25)} 0 0 0 1px`,
      borderRadius: 2,
      borderColor: "#24242f",
      borderBottom: "1px solid black",
      color: "black"
    }
  },
  focused: {},
}));

function RedditTextField(props) {
  const classes = useStylesReddit();

  return <TextField InputProps={{ classes, disableUnderline: true }} {...props} />;
}

const Signup = () => {
  const dispatch = useDispatch()
  const classes = useStyles();

  const selectedUser = useSelector(state => state.selectedUser);
  const history = useHistory()

  const [confirmationCode, setConfirmationCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [errMessageForConfirmationCode, setErrMessageForConfirmationCode] = useState('')
  const [errMessageForNewPassword, setErrMessageForNewPassword] = useState('')
  const [errMessageForConfirmPassword, setErrMessageForConfirmPassword] = useState('')
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)

  if (!selectedUser || !selectedUser.email) {
    dispatch({type: 'set', openSignup: false})
    dispatch({type: 'set', openSignin: false})
    dispatch({type: 'set', openEmailVerification: false})
    dispatch({type: 'set', forgotPassword1: true})
    dispatch({type: 'set', forgotPassword2: false})
    return;
  }

  const handleEnterKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  }

  const onSubmit = () => {
    if (selectedUser && JSON.stringify(selectedUser) !== '{}')
    userService.forgotPassword({
      "code": confirmationCode,
      "email": selectedUser.email,
      "password": password
    })
        .then(
            user => {
                if (user.status) {
                  successNotification("Your password is changed successfully.", 3000);
                  onClose()
                }
                else {
                  warningNotification(user.message, 3000);
                }
            },
            error => {
                warningNotification(error, 3000);
            }
        );
  }

  const onClose = () => {
    dispatch({type: 'set', openEmailVerification: false})
    dispatch({type: 'set', forgotPassword1: false})
    dispatch({type: 'set', forgotPassword2: false})
  }

//   useEffect(() => {
//     if (confirmationCode !== '' && password !== '' && errMessageForConfirmationCode === '' && errMessageForNewPassword === '' &&
//         errMessageForConfirmPassword === '' && password === confirmPassword) {
//       setSubmitButtonDisabled(false);
//     } else {
//       setSubmitButtonDisabled(true);
//     }
//   }, [confirmationCode, password, confirmPassword])

  return (
    <>
      <CWidgetSimple className="signin-widget text-left p-3 pt-0 pb-0 mx-auto">
        <div className="float-right" style={{marginRight: '-10px'}}>
          <CImg src={'/img/icons8-close.png'} style={{cursor: 'pointer'}} onClick={() => onClose()}></CImg>
        </div>
        <h2 className="text-left signin-header-title">Forgot password?</h2>
        <h5 className="text-left signin-header-desc">Please confirm your email and then reset your password.</h5>
        <div className="d-flex mt-3">
                {
                    <RedditTextField
                        id="verify-code"
                        label=""
                        placeholder="Type the confirmation code."
                        value={confirmationCode}
                        helperText={errMessageForConfirmationCode && errMessageForConfirmationCode !== '' ? errMessageForConfirmationCode : '' }
                        error={errMessageForConfirmationCode && errMessageForConfirmationCode !== ''}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <CImg src={'../img/email.png'} style={{width: '27px'}} />
                                        </InputAdornment>
                                      ),
                                      classes:{notchedOutline:classes.noBorder}
                                    }}
                        variant="outlined"
                        onKeyDown={handleEnterKeyDown}
                        onBlur={() => {
                          if (!confirmationCode || confirmationCode === '') setErrMessageForConfirmationCode('Full name is required')
                          else setErrMessageForConfirmationCode('')
                        }}
                        onKeyUp={() => {
                          if (!confirmationCode || confirmationCode === '') setErrMessageForConfirmationCode('Full name is required')
                          else setErrMessageForConfirmationCode('')
                        }}
                        onChange={(e) => {
                          setConfirmationCode(e.target.value); }}
                    />
                }
            </div>

            <div className="d-flex mt-3">
                {
                    <RedditTextField
                        id="password"
                        label=""
                        placeholder="Type your password"
                        value={password}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        type="password"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CImg src={'../img/password.png'} style={{width: '27px'}} />
                            </InputAdornment>
                          ),
                          classes:{notchedOutline:classes.noBorder}
                        }}
                        variant="outlined"
                        onKeyDown={handleEnterKeyDown}
                        helperText={errMessageForNewPassword && errMessageForNewPassword !== '' ? errMessageForNewPassword : '' }
                        error={errMessageForNewPassword && errMessageForNewPassword !== ''}
                        onBlur={() => {
                          if (!password || password === '') setErrMessageForNewPassword('Password is required')
                          else if (password.length < 6) setErrMessageForNewPassword('Password hat to be at least 6 characters!')
                          else if (!password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)) setErrMessageForNewPassword('Password must contain: numbers, uppercase and lowercase letters');
                          else setErrMessageForNewPassword('')
                        }}
                        onKeyUp={() => {
                          if (!password || password === '') setErrMessageForNewPassword('Password is required')
                          else if (password.length < 6) setErrMessageForNewPassword('Password hat to be at least 6 characters!')
                          else if (!password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)) setErrMessageForNewPassword('Password must contain: numbers, uppercase and lowercase letters');
                          else setErrMessageForNewPassword('')
                        }}
                        onChange={(e) => { setPassword(e.target.value); }}
                    />
                }
            </div>

            <div className="d-flex mt-3">
                {
                    <RedditTextField
                        id="confirm-password"
                        label=""
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        type="password"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CImg src={'../img/password.png'} style={{width: '27px'}} />
                            </InputAdornment>
                          ),
                          classes:{notchedOutline:classes.noBorder}
                        }}
                        variant="outlined"
                        onKeyDown={handleEnterKeyDown}
                        helperText={errMessageForConfirmPassword && errMessageForConfirmPassword !== '' ? errMessageForConfirmPassword : '' }
                        error={errMessageForConfirmPassword && errMessageForConfirmPassword !== ''}
                        onBlur={() => {
                          if (!confirmPassword || confirmPassword === '') setErrMessageForConfirmPassword('Password confirmation is required!')
                          else if (confirmPassword !== password) setErrMessageForConfirmPassword('Passwords must match')
                          else setErrMessageForConfirmPassword('')
                        }}
                        onKeyUp={() => {
                          if (!confirmPassword || confirmPassword === '') setErrMessageForConfirmPassword('Password confirmation is required!')
                          else if (confirmPassword !== password) setErrMessageForConfirmPassword('Passwords must match')
                          else setErrMessageForConfirmPassword('')
                        }}
                        onChange={(e) => { setConfirmPassword(e.target.value); }}
                    />
                }
            </div>

            <div className="m-auto text-center">
                <CButton className="signin-button mt-3 btn-pill" size="lg" color="info" onClick={() => onSubmit()} disabled={submitButtonDisabled}>
                  Reset your password
                </CButton>
            </div>
      </CWidgetSimple>
    </>
  )
}

export default Signup
