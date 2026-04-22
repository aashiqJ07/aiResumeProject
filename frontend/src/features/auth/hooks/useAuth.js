import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login,register,logout } from "../services/auth.api";

export const useAuth = () =>{
    const context = useContext(AuthContext)
    const {user,setUser , loading , setLoading } = context

    const handleLogin = async ({email,password}) => {
        setLoading(true)
        try{
            const data = await login({email,password})
            setUser(data.user)
            return { success: true }
        }catch(err){
            const message = err?.response?.data?.message || "Login failed. Please try again."
            console.log(err)
            return { success: false, message }
        }finally{
            setLoading(false)
        }
    }
    const handleRegister = async ({username,email,password}) => {
        setLoading(true)
        try{
            const data = await register({username,email,password})
            setUser(data.user)
            return { success: true }
        }catch(err){
            const message = err?.response?.data?.message || "Registration failed. Please try again."
            console.log(err)
            return { success: false, message }
        }finally{
            setLoading(false)
        }
    }
    const handleLogout = async () =>{
        setLoading(true)
        try{
            await logout()
            setUser(null)
            return true
        }catch(err){
            console.log(err)
            return false
        }finally{
            setLoading(false)
        }
    }

    return {user,loading,handleLogin,handleRegister,handleLogout}
} 