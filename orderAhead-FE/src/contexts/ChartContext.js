import React, { useContext } from 'react'

const ChartContext = React.createContext()

export const useChartOptions = () => {
  return useContext(ChartContext)
}

const ChartProvider = ({children}) => {
  const options = {
    chart: {
      zoom: {
        enabled: false,
      },
      height: '480',
    }
  }
  return (
    <ChartContext.Provider value={options}>
      {children}
    </ChartContext.Provider>
  )
}

export default ChartProvider