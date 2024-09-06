import { Link,useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { postLogout } from "../services/api"
import useToken from "../hooks/useToken"

const Navbar = () => {

  const navigate = useNavigate()

  const [user,setUser] = useState<{username:string,role:string}>()

  const token = useToken()

  useEffect(()=>{
    if(token){
      const data = jwtDecode<{username:string,role:string}>(token)
      setUser({username:data.username,role:data.role})
    }
  },[token])

  const handleLogout = ()=>{
    postLogout(token)
      .then(res=>{
        if(res.status === 200){
          Cookies.remove('access_token')
          alert('Berhasil Logout')
          navigate('/login')
        }
      })
      .catch(err=>{
        console.log(err)
      })
  }

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">
          Produk Olahan Kelapa
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><Link to='/'>Beranda</Link></li>
          {(user && user.role === 'admin') && 
          <li>
            <details>
              <summary>
                Admin
              </summary>
              <ul className="p-2 bg-base-100 rounded-t-none">
                <li><Link to='/admin/users' style={{whiteSpace:'nowrap'}}>Data User</Link></li>
                <li><Link to='/admin/toko' style={{whiteSpace:'nowrap'}}>Data Toko</Link></li>
                <li><Link to='/admin/produk' style={{whiteSpace:'nowrap'}}>Data Produk</Link></li>
                <li><Link to='/admin/pending-data' style={{whiteSpace:'nowrap'}}>Pending Data</Link></li>
              </ul>
            </details>
          </li>}
          <li>
            <details>
              <summary>
                Account
              </summary>
              <ul className="p-2 bg-base-100 rounded-t-none">
                <li><span>User: {user && user.username}</span></li>
                <li><span>Role: {user && user.role}</span></li>
                <li><a onClick={handleLogout}>Logout</a></li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar