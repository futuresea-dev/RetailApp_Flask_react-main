import React, { lazy, useEffect, useState } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { userService } from '../../controllers/_services';

const CreateLink = lazy(() => import('./CreateLink'));
const SendLink = lazy(() => import('./SendLink'));

const AdminLinkManage = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  dispatch({type: 'set', darkMode: false})

  const user = useSelector(state => state.user)
  const createLink = useSelector(state => state.createLink)
  const sendLink = useSelector(state => state.sendLink)

  if (!localStorage.getItem('userId') || !user || user.is_superuser !== 1) {
    dispatch({type: 'set', darkMode: true})
    history.push('/home')
  }

  const [linkList, setLinkList] = useState([]);

  const URL = window.location.protocol + "//" + window.location.host + '/signup/'

  useEffect(() => {
    userService.getAllLinks()
        .then(
        links => {
            setLinkList(links);
        },
        error => {}
    )
  }, [createLink, sendLink]);


  const onClickSend = (link) => {
    dispatch({type: 'set', sendLink: true})
    dispatch({type: 'set', selectedLink: {
        ...link,
        "code": URL + link.code
    }})
  }

  const onClickLinkCreate = () => {
    dispatch({type: 'set', createLink: true})
  }

  return (
    <>
      <CRow>
        <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border" sm="12" lg="12" md="12">
          <CCard color="transparent" className="transaction-table d-box-shadow1 d-border mt-3">
            <CCardHeader color="transparent d-border pl-0 pr-0" className="header-title">
                <CRow>
                    <CCol sm="12" md="7" lg="7">Link Manage</CCol>
                    <CCol sm="12" md="5" lg="5" className="text-right">
                        <CButton color="dark" onClick={() => onClickLinkCreate()}>Create</CButton>
                    </CCol>
                </CRow>
            </CCardHeader>
            <CCardBody className="p-0" color="default">
            { linkList && 
              <table className="table table-hover table-outline mb-0">
                <thead className="thead-light">
                  <tr>
                    <th>#</th>
                    <th className="text-center">Link</th>
                    <th className="text-center">Role</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                { linkList &&
                  linkList.map(linkItem => (
                    <tr>
                      <td>
                        {linkItem.id}
                      </td>
                      <td className="text-center">
                            {URL}{ linkItem.code }
                      </td>
                      <td className="text-center">
                        { linkItem.role }
                      </td>
                      <td className="text-center">
                          <CButton color="success" onClick={() => onClickSend(linkItem)}>SEND</CButton>
                      </td>
                    </tr>
                  ))
                }
                </tbody>
              </table>
            }
            { Object.assign([], linkList).length === 0 && 
              <h3 className="text-muted m-3 pt-3 text-center">NO LINK</h3>
            }
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      
      <CreateLink />
      <SendLink />
    </>
  )
}

export default AdminLinkManage
