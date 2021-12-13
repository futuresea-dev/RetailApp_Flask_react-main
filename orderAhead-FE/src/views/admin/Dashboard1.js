import React from 'react'
import SalesByCategory from '../../components/chart/SalesByCategory'
import SalesByDayOfWeek from '../../components/chart/SalesByDayOfWeek'
import SalesByWeekInYear from '../../components/chart/SalesByWeekInYear'
import SalesByWeekInYearAndCategory from '../../components/chart/SalesByWeekInYearAndCategory'

import DatatableCategory from '../../components/datatable/DatatableCategory'
import DatatableProductType from '../../components/datatable/DatatableProductType'
import ChartProvider from '../../contexts/ChartContext'

const Dashboard1 = () => {
  return (
    <ChartProvider>
      <h1>Dashboard 1</h1>

      <div className="row">
        <div className="col-4">
          <DatatableCategory />
        </div>
        <div className="col-4">
          <SalesByWeekInYear />
        </div>
        <div className="col-4">
          <SalesByWeekInYearAndCategory />
        </div>
      </div>

      <div className="row">
        <div className="col-4">
          <DatatableProductType />
        </div>
        <div className="col-4">
          <SalesByDayOfWeek />
        </div>
        <div className="col-4">
          <SalesByCategory />
        </div>
      </div>
    </ChartProvider>
  )
}

export default Dashboard1