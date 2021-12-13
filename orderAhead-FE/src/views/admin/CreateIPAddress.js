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

const IPAddress = () => {
  const dispatch = useDispatch()

  const saveAddress = useSelector(state => state.saveAddress)

  const handleClose = () => {
    dispatch({type: 'set', saveAddress: false})
  };

  const [isSubmiting, setIsSubmiting] = useState(false);
  const [ip_address, setIpAddress] = useState();

  const onSubmit = () => {
      if (saveAddress && ip_address != '') {
            setIsSubmiting(true)
            userService.createIP(ip_address).then(
              result => {
                  successNotification("Successfully sent", 3000);
                  handleClose()
                  setIsSubmiting(false)
              },
              err => {
                  console.log(err)
                  setIsSubmiting(false)
              }
            )
      }
  }

  return (
    <CModal 
        show={saveAddress} 
        onClose={handleClose}
        className="p-0 auth-modal"
        centered
        >
        <CModalBody className="p-3">
            <h3 className="p-3">Input IP Address</h3>

            { saveAddress && 
                <div className="d-flex mt-2 px-3">
                    <RedditTextField
                            id="ip_address"
                            label="IP ADDRESS"
                            placeholder="127.0.0.1"
                            fullWidth
                            value={ip_address}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e) => setIpAddress(e.target.value)}
                            variant="filled"
                        />
                </div>
            }
            
            <div className="d-flex mx-3 px-3 mt-2">
                <CButton block className="button-exchange p-1 pt-2" onClick={onSubmit}>
                    <h3>SAVE</h3>
                </CButton>
            </div>
        </CModalBody>
    </CModal>
  )
}

export default IPAddress
