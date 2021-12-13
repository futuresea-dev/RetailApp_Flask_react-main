import React, { lazy } from 'react'
import { CFooter, CRow, CCol } from '@coreui/react'

const TheFooter = () => {
  return (
    <>
      <CFooter colorscheme="dark" className="footer">
        <CRow className="subfooter">
          <CCol sm="12" lg="12" className="text-lg-right text-sm-center mr-0 pr-0">
            <span className="mr-0">all rights reserved &copy; 2021</span>
          </CCol>
        </CRow>
      </CFooter>
    </>
  )
}

export default React.memo(TheFooter)
