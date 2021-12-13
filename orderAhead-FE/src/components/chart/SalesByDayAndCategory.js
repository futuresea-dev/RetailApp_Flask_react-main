import React from 'react'
import Chart from 'react-apexcharts'
import { useChartOptions } from '../../contexts/ChartContext'
import _ from 'lodash'

const SalesByDayAndCategory = () => {
  const chartOptions = useChartOptions()
  const state = {
    options: {
      title: {
        text: "Sales by Day and Category"
      },
      chart: {
        id: "basic-bar",
        width: "100px",
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

  state.options = _.merge(state.options, chartOptions)
  console.log(state)
  return (
    <>
      <Chart
        options={state.options}
        series={state.series}
        type="line"
        height="480"
      />
    </>
  )
};

export default SalesByDayAndCategory;