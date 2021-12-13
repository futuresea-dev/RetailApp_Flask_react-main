import React, { useEffect, useMemo, useState } from 'react'
import Datatable from '../Datatable'
import { dashboardServices } from '../../controllers/_services/dashboard.service'

const DatatableProductType = (props) => {

  const hearderColumns = useMemo(() => {
    return [
      {
        label: 'Final Sort',
        field: 'product_type',
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
        label: 'First Category',
        field: 'category',
      },
    ]
  })

  const [datatable, setDatatable] = useState({
    columns: hearderColumns,
    rows: [],
  })
  useEffect(() => {
    dashboardServices.loadDatatableProductType().then((response) => {
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

export default DatatableProductType;