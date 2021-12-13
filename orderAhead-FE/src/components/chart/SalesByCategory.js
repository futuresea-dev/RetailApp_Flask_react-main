import React from 'react'
import Chart from 'react-apexcharts'
import { useChartOptions } from '../../contexts/ChartContext'
import _ from 'lodash'

// https://apexcharts.com/docs/options/plotoptions/pie/#labels
const SalesByCategory = () => {
  const chartOptions = useChartOptions()
  const state = {
    options: {
      title: {
        text: "Sales by Category"
      },
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
      },
      plotOptions: {
        pie: {
          donut: {
            size: '0%',
          },
        },
      },
    },
    series: [44, 55, 41, 17, 15],
  }

  _.merge(state.options, chartOptions)

  return (
    <>
      <Chart
        options={state.options}
        series={state.series}
        type="donut"
      />
    </>
  );
};

export default SalesByCategory;