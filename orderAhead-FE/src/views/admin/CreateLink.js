import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    CModal,
    CModalBody,
    CButton,
    CSelect
  } from '@coreui/react'
import { ROLE } from '../../controllers/_constants/roleconstants'
import { userService } from '../../controllers/_services';
import { successNotification, warningNotification } from '../../controllers/_helpers';

const CreateLink = () => {
  const dispatch = useDispatch()

  const createLink = useSelector(state => state.createLink)

  const handleClose = () => {
    dispatch({type: 'set', createLink: false})
  };

  const onSubmit = () => {
        userService.createLinkForSignup(ROLE[selectedRoleLevel - 1]).then(
            result => {
                successNotification("Successfully created", 3000);
                dispatch({type: 'set', createLink: false})

                setIsSubmiting(false)
            },
            err => {
                console.log(err)
                setIsSubmiting(false)
            }
        )
  }

  const [selectedRoleLevel, setSelectedRoleLevel] = useState(2)
  const [isSubmiting, setIsSubmiting] = useState(false);

  return (
    <CModal 
        show={createLink} 
        onClose={handleClose}
        className="p-0 auth-modal"
        centered
        >
        <CModalBody className="p-3">
            <h3 className="p-3">Create Sign Up link for users</h3>

            { createLink && 
                <div className="d-flex mt-2 px-3">
                    <CSelect custom size="lg" name="selectLg" id="selectLg" value={selectedRoleLevel} onChange={(e) => setSelectedRoleLevel(e.target.value)}>
                        { ROLE && 
                            ROLE.map(roleItem => (
                            <option value={roleItem.level}>{roleItem.label}</option>
                            ))
                        }
                    </CSelect>                    
                </div>
            }
            
            <div className="d-flex mx-3 px-3">
                <CButton block className="button-exchange p-1 pt-2" onClick={onSubmit} disabled={isSubmiting}>
                    <h3>CREATE</h3>
                </CButton>
            </div>
        </CModalBody>
    </CModal>
  )
}

export default CreateLink
