import React, { lazy, useEffect, useState } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CPagination
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { userService } from '../../controllers/_services';
import { dbManageService } from '../../controllers/_services/dbmanage.service';
import { errorNotification, warningNotification, successNotification } from '../../controllers/_helpers';
import useTable from './../widgets/useTable';

const CreateIPAddress = lazy(() => import('./CreateIPAddress'));

const AdminIPManage = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  dispatch({type: 'set', darkMode: false})

  const user = useSelector(state => state.user)
  const saveAddress = useSelector(state => state.saveAddress)

  const [columnsInfo, setColumnsInfo] = useState([])
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(tableData, page, 10);
  const [selectedTable, setSelectedTable] = useState();
  
  if (!localStorage.getItem('userId') || !user || user.is_superuser !== 1) {
    dispatch({type: 'set', darkMode: true})
    history.push('/home')
  }

  useEffect(() => {
    onSelectTable('IP manage')
  }, [user, saveAddress]);

  const onSelectTable = (tablename) => {

    setTableData([])

    dbManageService.getDataInfoByTableName(tablename)
        .then(
        info => {
            if (info.status) {
              setColumnsInfo(info.columns);
              setTableData(info.data);
            } else {
              errorNotification(info.message, 3000)    
            }
        },
        error => {
          errorNotification(error.message, 3000)
        }
    )
  }

  const setCurrentPage = (page) => {
    setPage(page)
  }


  const onClickDelete = (data) => {
    dbManageService.deleteIPAddress(data)
        .then(
        info => {
            if (info.status) {
                onSelectTable('IP manage')
            } else {
                errorNotification(info.message, 3000)    
            }
        },
        error => {
          errorNotification(error.message, 3000)
        }
    )
  }

  const onClickIPCreate = () => {
    dispatch({type: 'set', saveAddress: true})
  }

  return (
    <>
      <CRow>
        <CCol className="pr-lg-1 pr-md-1 d-box-shadow1 d-border" sm="12" lg="12" md="12">
          <CCard color="transparent" className="transaction-table d-box-shadow1 d-border mt-3">
            <CCardHeader color="transparent d-border pl-0 pr-0" className="header-title">
                <CRow>
                    <CCol sm="12" md="7" lg="7">IP Manage</CCol>
                    <CCol sm="12" md="5" lg="5" className="text-right">
                        <CButton color="dark" onClick={() => onClickIPCreate()}>Create</CButton>
                    </CCol>
                </CRow>
            </CCardHeader>
            <CCardBody className="p-0" color="default" style={{overflowX: "auto"}}>
            { columnsInfo && 
              <table className="table table-hover table-outline mb-0">
                <thead className="thead-light">
                  <tr>
                    { columnsInfo.map((column, inx) => (
                        <>
                            <th className="text-center" style={{textOverflow: "ellipsis", "whiteSpace": "nowrap"}}>{column}</th>
                            { inx == columnsInfo.length - 1 &&
                                <th className="text-right">Action</th>
                            }
                        </>
                      ))
                    }
                  </tr>
                </thead>
                <tbody>
                { slice &&
                  slice.map(item => (
                    <tr>
                      { item.map((detail, inx) => (
                        <>
                            <td style={{textOverflow: "ellipsis", "whiteSpace": "nowrap", cursor: "pointer"}}>
                                { detail }
                            </td>
                            { inx == item.length - 1 &&
                                <th className="text-right">
                                    <CButton color="warning" onClick={() => onClickDelete(detail)}>Delete</CButton>
                                </th>
                            }
                        </>
                        ))
                      }
                    </tr>
                  ))
                }
                </tbody>
              </table>
            }
            </CCardBody>
            { columnsInfo && tableData && tableData.length > 0 &&
              // <TableFooter range={range} slice={slice} setPage={setPage} page={page} lastPage={parseInt(tableData.length / 10) + 1  } />
              <CPagination
                align="end"
                activePage={page}
                pages={parseInt(tableData.length / 10) + 1 }
                onActivePageChange={setCurrentPage}
              />
            }
          </CCard>
        </CCol>
      </CRow>
      
      <CreateIPAddress />
    </>
  )
}

export default AdminIPManage
