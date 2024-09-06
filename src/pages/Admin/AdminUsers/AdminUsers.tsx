import { useEffect, useState } from "react"
import { deleteUser, getUsers } from "../../../services/api"
import Navbar from "../../../components/Navbar"
import { Link, useNavigate, useOutletContext } from "react-router-dom"
import { isAxiosError } from "axios"

type UsersRole = 'admin'|'user'

const AdminUsers = ()=>{

  const navigate = useNavigate()

  // GET DATA FROM AdminContainer
  const {token,userRole} = useOutletContext<{token:string,userRole:UsersRole}>()

  // GET AND SET USERS
  const [users,setUsers] = useState<{id:number,username:string,password:string,role:UsersRole}[]>()

  const getAndSetUsers = ()=>{
    getUsers(token)
      .then(res=>{
        setUsers(res.data.data)
      })
      .catch(err=>{
        if(err){
          console.log(err.message)
        }
      })
  }

  const hapusUser = (idUser:number)=>{
    let user = undefined
    if(users) [user] = users.filter(val=>val.id === idUser)

    if(window.confirm(`Hapus user dengan ${user?'username '+user.username:'id '+idUser}?`)){
      deleteUser(token,idUser)
        .then(res=>{
          if(res.status === 200){
            window.alert('Berhasil menghapus user!')
            // REFRESH
            navigate(0)
          }
        })
        .catch(err=>{
          if(isAxiosError(err) && err.response && err.response.status === 404) return alert('Gagal menghapus user, User tidak ditemukkan!')
          alert('Gagal menghapus user, Terjadi kesalahan!')
        })
    }
  }

  useEffect(()=>{
    if(token && userRole === 'admin'){
      getAndSetUsers()
    }
  },[token,userRole])

  return (
    <div className='container mx-auto'>
      <Navbar />
      <div className="py-10">
        <section className="flex flex-col items-center gap-12">
          <h2 className="text-lg font-bold text-center"><span className="text-red-500">[ADMIN]</span> Data Users/Pengguna</h2>
          <div className="flex gap-5">
            <Link to='/admin/users/tambah' className="btn btn-outline btn-success">+ Tambah User/Pengguna</Link>
          </div>
          <div className="overflow-x-auto self-stretch">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Username</th>
                  <th>Role</th>
                  <th style={{width: 200}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users && users.map((data, i) => (
                  <tr key={i}>
                    <th>{i+1}</th>
                    <td>{data.username}</td>
                    <td>{data.role}</td>
                    <td className="flex gap-2">
                      <Link className="btn btn-warning btn-sm" to={`/admin/users/${data.id}/ubah`} state={{id:data.id,username:data.username,password:data.password,role:data.role}}>
                        Ubah
                      </Link>
                      <button className="btn btn-error btn-sm" onClick={()=>hapusUser(data.id)}>
                        <span>
                          Hapus
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminUsers