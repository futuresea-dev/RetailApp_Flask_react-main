import React, { useEffect, useMemo, useState } from 'react'
import Datatable from '../Datatable'
import { dashboardServices } from '../../controllers/_services/dashboard.service'

const DatatableProfile = (props) => {

  const hearderColumns = useMemo(() => {
    return [
      {
        label: 'Price Profile Name',
        field: 'profile',
      },
      {
        label: 'Sales',
        field: 'sales',
      },
      {
        label: 'Units',
        field: 'units',
      },
    ]
  })

  const [datatable, setDatatable] = useState({
    columns: hearderColumns,
    rows: [],
  })
  useEffect(() => {
    dashboardServices.loadDatatableProfile().then((response) => {
      setDatatable({
        columns: hearderColumns,
        rows: response.data
      })
    })
  }, [])

  return (
    <>
      <Datatable data={datatable} />
    </>
  )
}

export default DatatableProfile;