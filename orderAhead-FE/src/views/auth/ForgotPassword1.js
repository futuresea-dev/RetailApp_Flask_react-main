import React, { useEffect, useState } from 'react'
import {
  CWidgetSimple,
  CButton,
  CImg
} from '@coreui/react'
import { useDispatch } from 'react-redux'
import { userService } from '../../controllers/_services/user.service';
import { warningNotification } from '../../controllers/_helpers';
import TextField from '@material-ui/core/TextField';
import {
    alpha,
    makeStyles,
  } from '@material-ui/core/styles';
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

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const classes = useStyles();

  const [email, setEmail] = useState()
  const [errMessageForEmail, setErrMessageForEmail] = useState('')

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)

  const onClose = () => {
    dispatch({type: 'set', openEmailVerification: false})
    dispatch({type: 'set', forgotPassword1: false})
    dispatch({type: 'set', forgotPassword2: false})
  }

  useEffect(() => {
    if (email !== '' && errMessageForEmail === '') {
      setSubmitButtonDisabled(false);
    } else {
      setSubmitButtonDisabled(true);
    }
  }, [ email ])

  const handleEnterKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  }

  const onSubmit = () => {
    userService.forgotPasswordToConfirmEmail(email)
      .then(
          result => {
            warningNotification("Please check your email to verify the account.", 3000)
            onClose()
            dispatch({type: 'set', forgotPassword2: true})
            dispatch({type: 'set', selectedUser: { "email": email }})
          },
          error => {
            warningNotification(error, 3000)
          }
      );
  }

  return (
    <>
      <CWidgetSimple className="signin-widget text-left p-3 pt-0 pb-0 mx-auto">
        <div className="float-right" style={{marginRight: '-10px'}}>
          <CImg src={'/img/icons8-close.png'} style={{cursor: 'pointer'}} onClick={() => onClose()}></CImg>
        </div>
        <h2 className="text-left signin-header-title">Forgot password?</h2>
        <h5 className="text-left signin-header-desc">Please confirm your email.</h5>
            <div className="d-flex mt-3">
                {
                    <RedditTextField
                        id="email"
                        label=""
                        placeholder="Type your email"
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

            <div className="m-auto text-center">
                <CButton className="signin-button mt-3 btn-pill" size="lg" color="info" onClick={() => onSubmit()} disabled={submitButtonDisabled}>
                  Confirm
                </CButton>
            </div>
      </CWidgetSimple>
    </>
  )
}

export default ForgotPassword
