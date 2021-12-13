import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CRow,
  CImg
} from '@coreui/react'
import { useDispatch } from 'react-redux'
import { userService } from '../../controllers/_services/user.service';
import { successNotification, warningNotification } from '../../controllers/_helpers';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import {
    alpha,
    makeStyles,
  } from '@material-ui/core/styles';
import { InputAdornment } from '@material-ui/core';

  const AuthDialog = React.lazy(() => import('../../views/auth/AuthDialog'));
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
      borderRadius: 10,
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
        borderRadius: 10,
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

const Signin = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const classes = useStyles();

  dispatch({type: 'set', darkMode: false})

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const [errMessageForEmail, setErrMessageForEmail] = useState('')
  const [errMessageForNewPassword, setErrMessageForNewPassword] = useState('')

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)

  useEffect(() => {
    if (email !== '' && password !== '' && errMessageForEmail === '' && errMessageForNewPassword === '' ) {
      setSubmitButtonDisabled(false);
    } else {
      setSubmitButtonDisabled(true);
    }
  }, [ email, password ])

  const handleEnterKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  }

  const onSubmit = () => {
    userService.login(email, password, true)
      .then(
          result => {
            if (result.status)  {
              dispatch({type: 'set', isLogin: true})
              successNotification('Welcome to Orderahead', 3000)
              if (result.is_superuser === 1) {
                dispatch({type: 'set', isAdmin: true})
                history.push('users')
              }
              else history.push('home')
            }
            else {
              dispatch({type: 'set', selectedUser: {
                "email": email,
                "password": password
              }})
              dispatch({type: 'set', openEmailVerification: true})
            }
          },
          error => {
            warningNotification(error, 3000)
          }
      );
  }

  return (
    // backgroundImage: "url(img/login-bg.jpg)", backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'
    <div className="c-app flex-row align-items-center bg-signin">
      <CContainer>
        <CRow>
          <CCol md="12">
            <CCardGroup className="m-auto" style={{
              borderRadius: "50px",
              overflow: "hidden",
              boxShadow:`${alpha("#6219D8", 0.1)} 0 0 0 20px`,
              maxWidth: '450px'
            }}>
              <CCard className="pt-3 pb-3">
                <CCardBody>
                    <h2 className="text-center signin-header-title">Sign In</h2>
                    <h5 className="text-left signin-header-desc">
                      {/* <div className="mt-1 text-left mb-0">
                        <h5 className="signin-header-desc">Doesn't have an account yet? <span className="span-underline" onClick={() => { history.push("signup") }}>Sign Up</span></h5>
                      </div> */}
                    </h5>
                    <div className="d-flex mt-3">
                        {
                            <RedditTextField
                                id="email"
                                label=""
                                placeholder="E-mail"
                                value={email}
                                helperText={errMessageForEmail && errMessageForEmail !== '' ? errMessageForEmail : '' }
                                error={errMessageForEmail && errMessageForEmail !== ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <CImg src={'/img/email.png'} style={{width: '27px'}} />
                                    </InputAdornment>
                                  ),
                                  classes:{notchedOutline:classes.noBorder}
                                }}
                                variant="outlined"
                                onKeyDown={handleEnterKeyDown}
                                onBlur={() => {
                                  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                  if (!email || email === '') setErrMessageForEmail('Email is required')
                                  else if (!re.test(String(email).toLowerCase())) setErrMessageForEmail('Invalid email address')
                                  else setErrMessageForEmail('')
                                }}
                                onKeyUp={() => {
                                  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                  if (!email || email === '') setErrMessageForEmail('Email is required')
                                  else if (!re.test(String(email).toLowerCase())) setErrMessageForEmail('Invalid email address')
                                  else setErrMessageForEmail('')
                                }}
                                onChange={(e) => {
                                  setEmail(e.target.value); }}
                            />
                        }
                    </div>

                    <div className="d-flex mt-3">
                        {
                            <RedditTextField
                                id="password"
                                label=""
                                placeholder="Password"
                                value={password}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                type="password"
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <CImg src={'/img/password.png'} style={{width: '22px'}} />
                                    </InputAdornment>
                                  ),
                                  classes:{notchedOutline:classes.noBorder}
                                }}
                                variant="outlined"
                                helperText={errMessageForNewPassword && errMessageForNewPassword !== '' ? errMessageForNewPassword : '' }
                                error={errMessageForNewPassword && errMessageForNewPassword !== ''}
                                onKeyDown={handleEnterKeyDown}
                                onBlur={() => {
                                  if (!password || password === '') setErrMessageForNewPassword('Password is required')
                                  else setErrMessageForNewPassword('')
                                }}
                                onChange={(e) => { setPassword(e.target.value); }}
                            />
                        }
                    </div>

                    {/* <div className="d-flex mt-2">
                      <h5 className="text-left signin-header-desc">By signing in or creating an account. you agree with our <span className="span-underline" onClick={() => {
                        history.push('/terms'); dispatch({type: 'set', openSignin: false}); dispatch({type: 'set', openSignup: false})
                      }}>Terms of Use</span> and <span className="span-underline" onClick={() => {
                        history.push('/privacy');  dispatch({type: 'set', openSignin: false}); dispatch({type: 'set', openSignup: false})}
                        }>Privacy Policy</span></h5>
                    </div> */}

                    <div className="mt-3 text-right p-0">
                      <h5 className="text-right signin-header-desc p-0 m-0">
                        <span className="span-underline" onClick={() => {
                            dispatch({type: 'set', openSignin: false})
                            dispatch({type: 'set', openSignup: false})
                            dispatch({type: 'set', forgotPassword1: true})
                          }}>
                          Forgot password?
                        </span>
                      </h5>
                    </div>

                    <div className="m-auto text-center">
                        <CButton className="signin-button mt-3 btn-pill" size="lg" color="info" onClick={() => onSubmit()} disabled={submitButtonDisabled}>
                            Sign In
                        </CButton>
                    </div>
                </CCardBody>
              </CCard>
              {/* <CCard className="text-white bg-primary py-5 d-md-down-none" style={{width: '44%', backgroundImage: "url(img/logo.jpg)", backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}}>
                <CCardBody className="text-center">
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <AuthDialog />
    </div>
  )
}

export default Signin
