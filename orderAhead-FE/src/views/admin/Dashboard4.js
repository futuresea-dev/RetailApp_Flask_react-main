import React from 'react'
import LbsSoldByMonthAndBrand from '../../components/chart/LbsSoldByMonthAndBrand'
import LbsSoldByMonthAndProfile from '../../components/chart/LbsSoldByMonthAndProfile'
import DatatableMonth from '../../components/datatable/DatatableMonth'
import DatatableProfile from '../../components/datatable/DatatableProfile'
import DatatableStrain from '../../components/datatable/DatatableStrain'
import ChartProvider from '../../contexts/ChartContext'

const Dashboard4 = () => {
  return (
    <ChartProvider>
      <h1>Dashboard4</h1>

      <div className="row">
        <div className="col-4">
          <DatatableProfile />
        </div>
        <div className="col-8">
          <LbsSoldByMonthAndBrand />
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <div className="row">
            <div className="col-4">
              <DatatableMonth />
            </div>
            <div className="col-8">
              <DatatableStrain />
            </div>
          </div>
        </div>
        <div className="col-8">
          <LbsSoldByMonthAndProfile />
        </div>
      </div>
    </ChartProvider>
  )
}

export default Dashboard4