import React from 'react'
import Chart from 'react-apexcharts'
import { useChartOptions } from '../../contexts/ChartContext'
import _ from 'lodash'

const SalesByWeekInYear = () => {
  const chartOptions = useChartOptions()
  const state = {
    options: {
      title: {
        text: "Sales by Week in year"
      },
      chart: {
        id: "SalesByWeekInYear"
      },
      xaxis: {
        type: 'category',
        categories: ['0', '20', '40'],
        labels: {
          show: true,
        }
      },
      yaxis: {
        labels: {
          formatter: function(val) {
            return parseFloat(val) + 'K'
          }
        }
      },
    },
    series: [
      {
        name: "series-1",
        data: [
          {
            x: 0,
            y: 14
          },
          {
            x: 20,
            y: 20
          },
          {
            x: 40,
            y: 10
          },
        ]
      }
    ]
  }
  _.merge(state.options, chartOptions)

  console.log(state)

  return (
    <>
      <Chart
        options={state.options}
        series={state.series}
        type="line"
      />
    </>
  )
};

export default SalesByWeekInYear;