import axios from "axios"
// import { err } from "react-native-svg/lib/typescript/xml"
import { SERVER_URL } from "../config"

const login= async (phoneNumber, password, setData, setAuth, navigation)=> {
    try {
        const res= await axios({
            url: SERVER_URL+ "/user/login",
            method: "post",
            data: {
                phoneNumber, password
            }
        })
        const result= await res.data
        if(parseInt(res.status) === 200 && result?.login === true) {
            setAuth(()=> true)
            setData(result)
            return navigation.navigate("Tab", {headerTitle: "Đoạn Chat"})
        }
        return setData(result)
        
    } catch (error) {
        return setData(error)
    }
}

export default login