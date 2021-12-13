import React, { useEffect, useMemo, useState } from 'react'
import Datatable from '../Datatable'
import { dashboardServices } from '../../controllers/_services/dashboard.service'

const DatatableCategory = (props) => {

  const hearderColumns = useMemo(() => {
    return [
      {
        label: 'Category',
        field: 'category',
      },
      {
        label: 'Sales',
        field: 'sales',
      },
      {
        label: 'Units Sold',
        field: 'units',
      },
      {
        label: 'gms. sold',
        field: 'gms_sold',
      },
    ]
  })

  const [datatable, setDatatable] = useState({
    columns: hearderColumns,
    rows: [],
  })
  useEffect(() => {
    dashboardServices.loadDatatableCategory().then((response) => {
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

export default DatatableCategory;