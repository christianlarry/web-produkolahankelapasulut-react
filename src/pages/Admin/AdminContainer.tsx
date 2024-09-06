import { Outlet } from "react-router-dom"
import useToken from "../../hooks/useToken"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

type UsersRole = 'admin'|'user'

const AdminContainer = ()=>{
  const token = useToken()

  // STATE
  const [userRole,setUserRole] = useState<UsersRole>() 

  useEffect(()=>{
    if(token){
      const data = jwtDecode<{role:UsersRole}>(token)
      setUserRole(data.role)
    }
  },[token])

  if(userRole && userRole !== 'admin') return (
    <div role="alert" className="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Error 401 Unauthorized. Anda tidak memiliki izin untuk menjelajahi halaman ini!</span>
    </div>
  )

  return <Outlet context={{token,userRole}}/>
}

export default AdminContainer