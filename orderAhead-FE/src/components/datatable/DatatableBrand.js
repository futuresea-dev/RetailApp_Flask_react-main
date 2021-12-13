import React, { useEffect, useMemo, useState } from 'react'
import Datatable from '../Datatable'
import { dashboardServices } from '../../controllers/_services/dashboard.service'

const DatatableBrand = (props) => {

  const hearderColumns = useMemo(() => {
    return [
      {
        label: 'Brand',
        field: 'brand',
      },
      {
        label: 'Sales',
        field: 'sales',
      },
      {
        label: 'Units Sold',
        field: 'units',
      },
    ]
  })

  const [datatable, setDatatable] = useState({
    columns: hearderColumns,
    rows: [],
  })
  useEffect(() => {
    dashboardServices.loadDatatableBrand().then((response) => {
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

export default DatatableBrand;