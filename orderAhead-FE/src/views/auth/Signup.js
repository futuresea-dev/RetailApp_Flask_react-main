import React, { useState, useEffect } from 'react'
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
import { useDispatch } from 'react-redux';
import { userService } from '../../controllers/_services';
import { successNotification, warningNotification } from '../../controllers/_helpers';
import TextField from '@material-ui/core/TextField';
import {
    alpha,
    makeStyles,
  } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import { InputAdornment } from '@material-ui/core';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



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
  const history = useHistory()
  const classes = useStyles();
  const { code } = useParams();

  const handleEnterKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  }

  const onSubmit = () => {
    setIsSubmitting(true);
    userService.register({
      // "first_name": firstName,
      // "last_name": lastName,
      "code": code,
      "username": username,
      "email": email,
      "password": password,
      "fullname": fullname,
      "medid": medid,
      "birthdate": birthdate,
    })
    .then(
        user => {
          if (user && user.status) {
            successNotification(user.message, 3000);
            // dispatch({type: 'set', openEmailVerification: false})
            setIsSubmitting(false);
            history.push("/signin")
          } else {
            warningNotification(user.message, 3000);
            setIsSubmitting(false);
          }
        },
        error => {
            warningNotification(error, 3000);
            setIsSubmitting(false);
        }
    );
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [firstName, setFirstName] = useState()
  const [lastName, setLastName] = useState()
  const [username, setUsername] = useState()
  const [fullname, setFullname] = useState()
  const [medid, setMedId] = useState()
  const [birthdate, setBirthDate] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()

  const [errMessageForFirstName, setErrMessageForFirstName] = useState('')
  const [errMessageForLastName, setErrMessageForLastName] = useState('')

  const [errMessageForUsername, setErrMessageForUsername] = useState('')
  const [errMessageForEmail, setErrMessageForEmail] = useState('')
  const [errMessageForNewPassword, setErrMessageForNewPassword] = useState('')
  const [errMessageForConfirmPassword, setErrMessageForConfirmPassword] = useState('')
  const [errMessageForFullname, setErrMessageForFullname] = useState('')
  const [errMessageForMedId, setErrMessageForMedId] = useState('')
  const [errMessageForBirthDate, setErrMessageForBirthDate] = useState('')
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)
  const [selectedRole, setSelectedRole] = useState('')

  useEffect(() => {
    if (username !== '' && email !== '' && password !== '' && errMessageForUsername === '' && errMessageForEmail === '' && errMessageForNewPassword === '' &&
        errMessageForConfirmPassword === '' && password === confirmPassword) {
      setSubmitButtonDisabled(false);
    } else {
      setSubmitButtonDisabled(true);
    }
  }, [username, email, password, confirmPassword])

  useEffect(() => {
    userService.confirmCodeBeforeSignup(code).then(
      result => {
        setSelectedRole(result.role)
      },
      err => {
        history.push('/')
      }
    )
  }, [code]);

  return (
    <div className="c-app c-default-layout flex-row align-items-center bg-signin">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="12">
            <CCardGroup className="m-auto" style={{
                borderRadius: "50px",
                overflow: "hidden",
                boxShadow:`${alpha("#6219D8", 0.1)} 0 0 0 20px`,
                maxWidth: '450px'
              }}>
              <CCard className="p-3">
                <CCardBody>
                  <div className="text-left pt-0 pb-0 mx-auto">
                    <h2 className="text-center signin-header-title">Welcome to <span className="text-success">{selectedRole}</span></h2>
                    {/* <h5 className="text-left signin-header-desc">
                        <div className="mt-1 text-left">
                          <h5 className="signin-header-desc">Already have an account? <span className="span-underline" onClick={() => { history.push("signin") }}>Sign in</span></h5>
                        </div>
                    </h5> */}

                        {/* Username */}
                        <div className="d-flex mt-3">
                            {
                                <RedditTextField
                                    id="user-name"
                                    label=""
                                    placeholder="Username"
                                    value={username}
                                    helperText={errMessageForUsername && errMessageForUsername !== '' ? errMessageForUsername : '' }
                                    error={errMessageForUsername && errMessageForUsername !== ''}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onKeyDown={handleEnterKeyDown}
                                    fullWidth
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <CImg src={'../img/user.png'} style={{width: '27px'}} />
                                        </InputAdornment>
                                      ),
                                      classes:{notchedOutline:classes.noBorder}
                                    }}
                                    variant="outlined"
                                    onBlur={() => {
                                      if (!username || username === '') setErrMessageForUsername('Username is required')
                                      else setErrMessageForUsername('')
                                    }}
                                    onKeyUp={() => {
                                      if (!username || username === '') setErrMessageForUsername('Username is required')
                                      else setErrMessageForUsername('')
                                    }}
                                    onChange={(e) => {
                                      setUsername(e.target.value); }}
                                />
                            }
                        </div>

                        {/* Fullname */}
                        {
                          selectedRole == 'Customer' &&
                          <div className="d-flex mt-3">
                                  <RedditTextField
                                      id="fullname"
                                      label=""
                                      placeholder="Fullname"
                                      value={fullname}
                                      helperText={errMessageForFullname && errMessageForFullname !== '' ? errMessageForFullname : '' }
                                      error={errMessageForFullname && errMessageForFullname !== ''}
                                      InputLabelProps={{
                                          shrink: true,
                                      }}
                                      onKeyDown={handleEnterKeyDown}
                                      fullWidth
                                      InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <CImg src={'../img/user.png'} style={{width: '27px'}} />
                                          </InputAdornment>
                                        ),
                                        classes:{notchedOutline:classes.noBorder}
                                      }}
                                      variant="outlined"
                                      onBlur={() => {
                                        if (!fullname || fullname === '') setErrMessageForFullname('Fullname is required')
                                        else setErrMessageForFullname('')
                                      }}
                                      onKeyUp={() => {
                                        if (!fullname || fullname === '') setErrMessageForFullname('Fullname is required')
                                        else setErrMessageForFullname('')
                                      }}
                                      onChange={(e) => {
                                        setFullname(e.target.value); }}
                                  />
                          </div>
                        }

                        {/* E-mail */}
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
                                          <CImg src={'../img/email.png'} style={{width: '27px'}} />
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

                        {/* Password */}
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
                                          <CImg src={'../img/password.png'} style={{width: '27px'}} />
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

                        {/* Confirm password */}
                        <div className="d-flex mt-3">
                            {
                                <RedditTextField
                                    id="confirm-password"
                                    label=""
                                    placeholder="Confirm password"
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
                                    helperText={errMessageForConfirmPassword && errMessageForConfirmPassword !== '' ? errMessageForConfirmPassword : '' }
                                    error={errMessageForConfirmPassword && errMessageForConfirmPassword !== ''}
                                    onKeyDown={handleEnterKeyDown}
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

                        {/* Med ID */}
                        {
                          selectedRole == 'Customer' &&
                          (
                            <>
                              <div className="d-flex mt-3">
                                  <RedditTextField
                                      id="medid"
                                      label=""
                                      placeholder="MedId"
                                      value={medid}
                                      helperText={errMessageForMedId && errMessageForMedId !== '' ? errMessageForMedId : '' }
                                      error={errMessageForMedId && errMessageForMedId !== ''}
                                      InputLabelProps={{
                                          shrink: true,
                                      }}
                                      onKeyDown={handleEnterKeyDown}
                                      fullWidth
                                      InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <CImg src={'../img/user.png'} style={{width: '27px'}} />
                                          </InputAdornment>
                                        ),
                                        classes:{notchedOutline:classes.noBorder}
                                      }}
                                      variant="outlined"
                                      onBlur={() => {
                                        if (!medid || medid === '') setErrMessageForMedId('MedId is required')
                                        else setErrMessageForMedId('')
                                      }}
                                      onKeyUp={() => {
                                        if (!medid || medid === '') setErrMessageForMedId('MedId is required')
                                        else setErrMessageForMedId('')
                                      }}
                                      onChange={(e) => {
                                        setMedId(e.target.value); }}
                                  />
                              </div>

                              {/* Birth Date */}
                              {/* <div className="d-flex mt-3">
                                  <RedditTextField
                                      id="birthdate2"
                                      label=""
                                      placeholder="BirthDate"
                                      value={birthdate}
                                      helperText={errMessageForBirthDate && errMessageForBirthDate !== '' ? errMessageForBirthDate : '' }
                                      error={errMessageForBirthDate && errMessageForBirthDate !== ''}
                                      InputLabelProps={{
                                          shrink: true,
                                      }}
                                      onKeyDown={handleEnterKeyDown}
                                      fullWidth
                                      InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <CImg src={'../img/user.png'} style={{width: '27px'}} />
                                          </InputAdornment>
                                        ),
                                        classes:{notchedOutline:classes.noBorder}
                                      }}
                                      variant="outlined"
                                      onBlur={() => {
                                        if (!birthdate || birthdate === '') setErrMessageForBirthDate('BirthDate is required')
                                        else setErrMessageForBirthDate('')
                                      }}
                                      onKeyUp={() => {
                                        if (!birthdate || birthdate === '') setErrMessageForBirthDate('BirthDate is required')
                                        else setErrMessageForBirthDate('')
                                      }}
                                      onChange={(e) => {
                                        setBirthDate(e.target.value); }}
                                  >

                                  </RedditTextField>


                              </div> */}

                              <div className="d-flex mt-3">

                                <div className="MuiInputBase-root MuiOutlinedInput-root Mui-error Mui-error MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedStart MuiOutlinedInput-adornedStart">
                                  <div className="MuiInputAdornment-root MuiInputAdornment-positionStart"><img className="" src={'../img/user.png'} style={{width: '27px'}} /></div>
                                  <DatePicker
                                    id="birthdate"
                                    selected={birthdate}
                                    popperPlacement="top-end"
                                    dateFormat="dd/MM/yyyy"
                                    onChange={(date) => {setBirthDate(date); }}
                                    style={{
                                      backgroundColor: 'red'
                                    }}
                                    placeholderText="Birth date"
                                  />
                                  <fieldset aria-hidden="true" className="PrivateNotchedOutline-root-4 MuiOutlinedInput-notchedOutline makeStyles-noBorder-1" style={{paddingLeft: '8px'}}>
                                  <legend className="PrivateNotchedOutline-legend-5" style={{width: '0.01px'}}><span>​</span></legend></fieldset>
                                </div>

                              </div>


                            </>
                          )
                        }

                        {/* <div className="d-flex mt-2">
                          <h5 className="text-left signin-header-desc">By signing in or creating an account. you agree with our <span className="span-underline" onClick={() => {
                            history.push('/terms');  dispatch({type: 'set', openSignin: false}); dispatch({type: 'set', openSignup: false})}}
                            >Terms of Use</span> and <span className="span-underline" onClick={() => {
                              dispatch({type: 'set', openSignin: false}); dispatch({type: 'set', openSignup: false}); history.push('/privacy')
                            }}>Privacy Policy</span></h5>
                        </div> */}

                        <div className="m-auto text-center">
                            <CButton className="signin-button mt-3 btn-pill" size="lg" color="info" onClick={() => onSubmit()} disabled={isSubmitting}>
                              SIGN UP
                            </CButton>
                        </div>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Signup
