import axios from "axios"
import { SERVER_URL } from "../config"

const update_info_user= async(idUser, newUsername, newGender, newAvatar, accessToken)=> {
    const res= await axios({
        url: SERVER_URL + `/api/users/edit-infor/${idUser}`,
        method: "post",
        headers: {
            'authorization': `Bearer `+ accessToken
        },
        data: {
            newUsername: newUsername, newProfilePicture: newAvatar, newGender
        }
    })
    const result= await res.data
    return result
}

export default update_info_user