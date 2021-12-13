import React, { useState, useContext } from 'react'

const FullwidthContext = React.createContext()
const FullwidthUpdateContext = React.createContext()


export const useFullwidth = () => {
  return useContext(FullwidthContext)
}

export const useFullwidthUpdate = () => {
  return useContext(FullwidthUpdateContext)
}

const ThemeProvider = ({children}) => {
  const [fullwidth, setFullwidth] = useState(false)


  return (
    <FullwidthContext.Provider value={fullwidth}>
      <FullwidthUpdateContext.Provider value={setFullwidth}>
        {children}
      </FullwidthUpdateContext.Provider>
    </FullwidthContext.Provider>
  )
}

export default ThemeProvider