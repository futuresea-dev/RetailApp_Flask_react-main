import React from 'react'
import Chart from 'react-apexcharts'
import ChartProvider, { useChartOptions } from '../../contexts/ChartContext'
import _ from 'lodash'

const SalesByWeekInYearAndMonth = () => {
  const chartOptions = useChartOptions()
  const state = {
    options: {
      title: {
        text: "Sales by Week in year and Month"
      },
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
      }
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }
    ]
  }

  _.merge(state.options, chartOptions)

  return (
    <>
      <Chart
        options={state.options}
        series={state.series}
        type="scatter"
        width="100%"
      />
    </>
  )
};

export default SalesByWeekInYearAndMonth;