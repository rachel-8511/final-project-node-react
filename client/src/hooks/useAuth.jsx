import { useSelector } from "react-redux"
import { selectToken } from "../features/auth/authSlice"
import {jwtDecode}from "jwt-decode"

const useAuth = () => {
    const token =useSelector(selectToken)
    let isAdmin = false
    let isUser = false

    if (token) {
        const userDecode=jwtDecode(token)
        const {_id,firstName,lastName,email,defaultAddress,basket,roles,user_id,phone}=userDecode
        isUser = roles === "user"
        isAdmin = roles === "admin"
        return {_id,firstName,lastName,email,defaultAddress,basket,isAdmin,isUser,user_id,phone,roles}
    }
    

    return {_id:'',firstName:'',lastName:'',email:'',roles:"",defaultAddress:null,basket:null,user_id: '',phone:''}
}

export default useAuth

