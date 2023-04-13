import React, { createContext, useContext, useEffect, useState } from 'react'
import get_profile_user from '../../api/user/get_profie_user';
import { SocketContainerContext } from '../SocketContainer/SocketContainer';

export const AuthContext= createContext()
const AuthContainer = ({children}) => {
  const { socketState }= useContext(SocketContainerContext)
  const [data, setData] = useState({});
  const [auth, setAuth] = useState(false);
  const [change, setChange]= useState(false)
  const [data2, setData2]= useState()
  useEffect(()=> {
    if(data?.user?._id && data?.accessToken) {
      (async ()=> {
        const result= await get_profile_user(data?.user?._id, data?.accessToken)
        return setData2(result)
      })()
    }
  }, [data, change])
  useEffect(()=> {
    if(data2?._id) {
      socketState?.emit("join_room_self", {meId: data2?._id})
    }
  }, [data2?._id])
  return (
    <AuthContext.Provider value={{data, auth, setData, setChange, setAuth, change, data2, setData2}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContainer