import React from 'react'
import SalesByDay from '../../components/chart/SalesByDay'
import SalesByDayAndCategory from '../../components/chart/SalesByDayAndCategory'
import DatatableBrand from '../../components/datatable/DatatableBrand'
import DatatableCategory from '../../components/datatable/DatatableCategory'
import ChartProvider from '../../contexts/ChartContext'

const Dashboard3 = () => {
  return (
    <ChartProvider>
      <h1>Dashboard 3</h1>

      <div className="row half-height">
        <div className="col-4">
          <DatatableCategory />
        </div>
        <div className="col-8">
          <SalesByDayAndCategory />
        </div>
      </div>
      <div className="row half-height">
        <div className="col-4">
          <DatatableBrand />
        </div>
        <div className="col-8">
          <SalesByDay />
        </div>
      </div>
    </ChartProvider>
  )
}

export default Dashboard3