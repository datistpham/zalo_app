import React, { createContext, useEffect, useState } from 'react'


export const AuthContext= createContext()
const AuthContainer = ({children}) => {
  const [data, setData] = useState({});
  const [auth, setAuth] = useState(false);
  const [change, setChange]= useState(false)
  
  return (
    <AuthContext.Provider value={{data, auth, setData, setChange, setAuth, change}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContainer