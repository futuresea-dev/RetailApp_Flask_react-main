import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    CModal,
    CModalBody,
    CButton
  } from '@coreui/react'
import TextField from '@material-ui/core/TextField';
import {
    makeStyles,
    } from '@material-ui/core/styles';
import { userService } from '../../controllers/_services';
import { successNotification, warningNotification } from '../../controllers/_helpers';

const useStylesReddit = makeStyles((theme) => ({
    root: {
        border: 'none',
        overflow: 'hidden',
        backgroundColor: '#fcfcfb',
        fontWeight: '700',
        lineHeight: '24px',
        fontSize: '24px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:hover': {
            backgroundColor: '#fff',
            border: 'none',
            borderColor: 'transparent'
          },
          '&$focused': {
            backgroundColor: '#fff',
            boxShadow: 'none',
            color: "#24242f",
            borderColor: "#fff",
            border: 'none',
          }
    },
    focused: {},
    }));

function RedditTextField(props) {
    const classes = useStylesReddit();
    
    return <TextField InputProps={{ classes, disableUnderline: true }} {...props} />;
    }

const SendLink = () => {
  const dispatch = useDispatch()

  const sendLink = useSelector(state => state.sendLink)
  const selectedLink = useSelector(state => state.selectedLink)

  const handleClose = () => {
    dispatch({type: 'set', sendLink: false})
    dispatch({type: 'set', selectedLink: {}})
  };

  const onSubmit = () => {
      if (selectedLink && sendEmail !== '') {
            setIsSubmiting(true)
            userService.sendLink({
                ...selectedLink,
                "sendEmail": sendEmail
            }).then(
              result => {
                  successNotification("Successfully sent", 3000);
                  dispatch({type: 'set', sendLink: false})
                  dispatch({type: 'set', selectedLink: {}})
                  setIsSubmiting(false)
              },
              err => {
                  console.log(err)
                  setIsSubmiting(false)
              }
            )
      }
  }

  const [isSubmiting, setIsSubmiting] = useState(false);
  const [sendEmail, setSendEmail] = useState();

  return (
    <CModal 
        show={sendLink} 
        onClose={handleClose}
        className="p-0 auth-modal"
        centered
        >
        <CModalBody className="p-3">
            <h3 className="p-3">Send the link</h3>

            { selectedLink && 
                <div className="d-flex mt-2 px-3">
                    <RedditTextField
                            id="email"
                            label="EMAIL"
                            placeholder="Email"
                            fullWidth
                            value={sendEmail}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e) => setSendEmail(e.target.value)}
                            variant="filled"
                        />
                </div>
            }
            
            <div className="d-flex mx-3 px-3">
                <CButton block className="button-exchange p-1 pt-2" onClick={onSubmit}>
                    <h3>SEND</h3>
                </CButton>
            </div>
        </CModalBody>
    </CModal>
  )
}

export default SendLink
