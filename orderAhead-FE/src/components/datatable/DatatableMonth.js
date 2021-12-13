import React, { useEffect, useMemo, useState } from 'react'
import Datatable from '../Datatable'
import { dashboardServices } from '../../controllers/_services/dashboard.service'

const DatatableMonth = (props) => {

  const hearderColumns = useMemo(() => {
    return [
      {
        label: 'Month',
        field: 'month',
      },
      {
        label: 'lbs. sold',
        field: 'lbs_sold',
      },
    ]
  })

  const [datatable, setDatatable] = useState({
    columns: hearderColumns,
    rows: [],
  })
  useEffect(() => {
    dashboardServices.loadDatatableMonth().then((response) => {
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

export default DatatableMonth;