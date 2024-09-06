import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie'
import { isAxiosError } from "axios"
import { checkToken } from "../services/api"

const useToken = ():string=>{
  const [token,setToken] = useState<string>('')
  const navigate = useNavigate()

  useEffect(()=>{
    const tokenCookie = Cookies.get('access_token')
    if (!tokenCookie) return navigate('/login')

    setToken(tokenCookie)
  },[])
  
  useEffect(()=>{
    if(token && token != ''){
      checkToken(token).catch(err=>{
        if(isAxiosError(err)){
          if(err.response && (err.response.status === 401 || err.response.status === 403)) {
            Cookies.remove('access_token')
            setToken('')
            navigate('/login')
          }
        }
      })
    }
  }, [token])

  return token
}

export default useToken