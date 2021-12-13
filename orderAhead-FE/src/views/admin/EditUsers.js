import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    CModal,
    CModalBody,
    CButton,
    CSelect
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

const EditUser = () => {
  const dispatch = useDispatch()

  const editUser = useSelector(state => state.editUser)
  const selectedUser = useSelector(state => state.selectedUser)

  const handleClose = () => {
    dispatch({type: 'set', editUser: false})
    dispatch({type: 'set', selectedUser: {}})
  };

  const onSubmit = () => {
      if (selectedUser) {
            userService.updateForAdmin({
                ...selectedUser,
                "is_active": activeState
            }).then(
              result => {
                    successNotification("Successfully updated", 3000);
                    dispatch({type: 'set', editUser: false})
                    dispatch({type: 'set', selectedUser: {}})
              },
              err => {
                  console.log(err)
              }
            )
      }
  }

  const [isSubmiting, setIsSubmiting] = useState(false);
  const [activeState, setActiveState] = useState(0)

  useEffect(() => {
      if (selectedUser) {
          setActiveState(selectedUser.is_active)
      }
  }, [selectedUser])

  return (
    <CModal 
        show={editUser} 
        onClose={handleClose}
        className="p-0 auth-modal"
        centered
        >
        <CModalBody className="p-3">
            <h3 className="p-3">User Information</h3>

            { selectedUser && 
                <div className="d-flex mt-2 px-3">
                    <RedditTextField
                            id="first-name"
                            label="FIRST NAME"
                            placeholder="First name"
                            fullWidth
                            value={selectedUser.first_name}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e) => selectedUser.first_name = e.target.value}
                            variant="filled"
                        />
                </div>
            }

            { selectedUser && 
                <div className="d-flex mt-2 px-3">
                    <RedditTextField
                            id="last-name"
                            label="LAST NAME"
                            placeholder="Last name"
                            fullWidth
                            value={selectedUser.last_name}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e) => selectedUser.last_name = e.target.value}
                            variant="filled"
                        />
                </div>
            }

            { selectedUser && 
                <div className="d-flex mt-2 px-3">
                    <RedditTextField
                            id="username"
                            label="USERNAME"
                            placeholder="Username"
                            fullWidth
                            value={selectedUser.username}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e) => selectedUser.username = e.target.value}
                            variant="filled"
                        />
                </div>
            }

            { selectedUser && 
                <div className="d-flex mt-2 px-3">
                    <RedditTextField
                            id="email"
                            label="EMAIL"
                            placeholder="Email"
                            fullWidth
                            value={selectedUser.email}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e) => selectedUser.email = e.target.value}
                            variant="filled"
                        />
                </div>
            }

            { selectedUser && 
                <CSelect custom size="lg" className="p-1 mt-2 mb-2" name="selectLg" id="selectLg" value={activeState} onChange={(e) => setActiveState(e.target.value)}>
                    <option value="0">Pending</option>
                    <option value="1">Active</option>
                </CSelect>                    
            }
            
            <div className="d-flex mx-3 px-3">
                <CButton block className="button-exchange p-1 pt-2" onClick={onSubmit}>
                    <h3>Save</h3>
                </CButton>
            </div>
        </CModalBody>
    </CModal>
  )
}

export default EditUser
