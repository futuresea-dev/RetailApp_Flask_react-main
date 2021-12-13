import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    CModal,
    CModalBody,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTextarea,
  } from '@coreui/react'
import { userService } from '../../controllers/_services';
import { successNotification, warningNotification } from '../../controllers/_helpers';

const ViewItemDB = () => {
  const dispatch = useDispatch()

  const viewItemDB = useSelector(state => state.viewItemDB)
  const originData = useSelector(state => state.viewDetail)
  const viewColumn = useSelector(state => state.viewColumn)
  const selectedTable = useSelector(state => state.selectedTable)

  const [viewDetail, setViewDetail] = useState(originData)

  useEffect(() => {
      setViewDetail(originData)
  }, [originData])

  const handleClose = () => {
    dispatch({type: 'set', viewItemDB: false})
    dispatch({type: 'set', viewDetail: []})
  };

  const updateDetailItem = (value, index) => {
      setViewDetail([
          ...viewDetail.slice(0, index),
          value,
          ...viewDetail.slice(index + 1)
      ])
  }

  const onUpdate = () => {
    if (viewDetail) {
          const obj = {
            "table_name": selectedTable,
            "column": viewColumn,
            "data": viewDetail
          }

          userService.updateDBForAdmin(obj).then(
            result => {
                  successNotification("Successfully updated", 3000);
                  handleClose()
            },
            err => {
                warningNotification("Failed. Please input the data again.", 3000)
            }
          )
    }
 }

  return (
    <CModal 
        show={viewItemDB} 
        onClose={handleClose}
        className="p-0"
        size="lg"
        >
        <CModalBody className="p-3">
            <h3 className="p-3" onClick={handleClose} style={{cursor: "pointer"}}>{selectedTable}</h3>
            <CRow>
                { selectedTable && viewDetail && viewColumn && 
                    viewDetail.map((item, index) => (
                        <CCol xs="12" sm="12" md="12" className="m-0 p-0 px-1">
                            <CCard className="m-0">
                                <CCardHeader className="view-table-header">
                                    {viewColumn[index]}
                                </CCardHeader>
                                <CCardBody className="view-table-content">
                                    { viewColumn[index] != 'insert_datetime' ?
                                        (
                                            !viewDetail[index] || viewDetail[index] == null || ("" + viewDetail[index]).indexOf("/", 1) != 2?
                                                <CTextarea className="m-0 p-0 px-1 view-table-content" value={viewDetail[index]} onChange={(e) => updateDetailItem(e.target.value, index)} ></CTextarea>
                                            : item
                                        )
                                    : item
                                    }
                                </CCardBody>
                            </CCard>
                        </CCol>
                    ))
                }
            </CRow>
            
            <div className="d-flex mx-3 px-3 mt-2">
                <CButton block className="button-exchange p-1 pt-2" onClick={onUpdate}>
                    <h3 style={{fontSize: "medium"}}>Update</h3>
                </CButton>

                <CButton block className="button-exchange p-1 pt-2" onClick={handleClose}>
                    <h3 style={{fontSize: "medium"}}>Close</h3>
                </CButton>
            </div>
        </CModalBody>
    </CModal>
  )
}

export default ViewItemDB
