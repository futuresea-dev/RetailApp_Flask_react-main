import React from 'react'
import SalesByMonth from '../../components/chart/SalesByMonth'
import SalesByWeekInYear from '../../components/chart/SalesByWeekInYear'
import SalesByWeekInYearAndMonth from '../../components/chart/SalesByWeekInYearAndMonth'
import DatatableCategory from '../../components/datatable/DatatableCategory'
import DatatableMonth from '../../components/datatable/DatatableMonth'
import ChartProvider from '../../contexts/ChartContext'

const Dashboard2 = () => {
  return (
    <ChartProvider>
      <h1>Dashboard 2</h1>

      <div className="row">
        <div className="col-4">
          <DatatableCategory maxHeight="100vh" />
        </div>
        <div className="col-8">
          <div className="row">
            <div className="col-8">
              <SalesByWeekInYear />
            </div>
            <div className="col-4">
              <DatatableMonth />
            </div>
          </div>

          <div className="row">
            <div className="col-5">
              <SalesByMonth />
            </div>
            <div className="col-7">
              <SalesByWeekInYearAndMonth />
            </div>
          </div>
        </div>
      </div>
    </ChartProvider>
  )
}

export default Dashboard2