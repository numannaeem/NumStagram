import axios from "axios";
import baseUrl from "./baseUrl";
import Cookies from "js-cookie";

const getUserInfo = async (userToFindId) => {
    try {
        console.log('trying')
        const res = await axios.get(`${baseUrl}/api/chats/user/${userToFindId}`, {
            headers: { Authorization: Cookies.get('token') }
        })
        return { name: res.data.name, profilePicUrl: res.data.profilePicUrl }
    } catch (error) {
        console.log(error)
        alert("Error finding user")
    }
}

export default getUserInfo