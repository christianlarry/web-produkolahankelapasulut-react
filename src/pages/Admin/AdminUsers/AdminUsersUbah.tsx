import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import Navbar from "../../../components/Navbar"
import { useEffect, useState } from "react"
import { getUserById, patchUserPassword, putUser } from "../../../services/api"
import { isAxiosError } from "axios"

type UsersRole = 'admin'|'user'

const AdminUsersUbah = () => {

  // MENGAMBIL PARAMTER ID PADA URL
  const {id} = useParams()
  if(isNaN(Number(id)) || Number(id)===0 || !id) return (
    <div role="alert" className="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Error 400. ID USER pada url tidak valid!</span>
    </div>
  )

  const navigate = useNavigate()
  const {token} = useOutletContext<{token:string}>()

  // AMBIL DATA USER
  const [user,setUser] = useState<{id:number,username:string,password:string,role:UsersRole}>()
	const [isNotFound,setIsNotFound] = useState<boolean>(false)
  useEffect(()=>{
    if(token){
      getUserById(token,Number(id))
        .then(res=>{
          if(res.status === 200) setUser(res.data.data[0])
        })
        .catch(err=>{
          if(isAxiosError(err) && err.response && err.response.status === 404) setIsNotFound(true)
        })
    }
  },[token])

  // STATE INPUT
  const [username,setUsername] = useState<string>()
  const [role,setRole] = useState<'user'|'admin'>()
  const [password,setPassword] = useState<string>()

  useEffect(()=>{
    if(user){
      setUsername(user.username)
      setRole(user.role)
      // PASSWORD HARUS KOSONG
    }
  },[user])

  // STATE ERROR MSG
  const [reqError,setReqError] = useState<{msg:string,path:string}[]>()
  const [patchPassError,setPatchPassError] = useState<{msg:string,path:string}[]>()

  const handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault()

    if(username && role && window.confirm('Konfirmasi, Ubah data?')){
      putUser(token,Number(id),{username,role})
        .then(res=>{
          if(res.status === 200){
            setReqError(undefined)
            if(window.confirm('Berhasil mengubah user/pengguna, Kembali ke halaman daftar pengguna?')) return navigate('/admin/users')
          }
        })
        .catch(err=>{
          if(isAxiosError(err) && err.response){
            if(err.response.status === 400 && err.response.data.error.input) return setReqError(err.response.data.error.input)
            if(err.response.status === 404) return alert('Terjadi kesalahan. User tidak ditemukkan!')
          }
        })
    }
  }

  const handlePasswordFormSubmit = (e:React.FormEvent)=>{
    e.preventDefault()
    if(password && window.confirm('Konfirmasi, Ubah password?')){
      patchUserPassword(token,Number(id),{newPassword: password})
        .then(res=>{
          if(res.status === 200){
            setPatchPassError(undefined)
            if(e.target instanceof HTMLFormElement) e.target.reset()
            if(window.confirm('Berhasil mengubah password user/pengguna, Kembali ke halaman daftar pengguna?')) return navigate('/admin/users')
          }
        })
        .catch(err=>{
          if(isAxiosError(err) && err.response){
            if(err.response.status === 400 && err.response.data.error.input) return setPatchPassError(err.response.data.error.input)
            if(err.response.status === 404) return alert('Terjadi kesalahan. User tidak ditemukkan!')
          }
        })
    }
  }

  if(user) return (
    <div className="container mx-auto">
      <Navbar />
      <div className="py-10">
        <section className="flex flex-col items-center gap-12">
          <button className="btn btn-outline btn-error btn-sm" onClick={()=>navigate(-1)}>&lt; Kembali</button>
          <h2 className="text-lg font-bold text-center"><span className="text-red-500">[ADMIN]</span> Ubah Users/Pengguna</h2>
          <form style={{width: 320}} onSubmit={handleSubmit}>
            {reqError &&
            <div role="alert" className="alert alert-error flex flex-col items-start my-2">
              {reqError.map((err, i) => (
                <div key={i} className="flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{err.path}: {err.msg}</span>
                </div>
              ))}
            </div>
            }
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Masukkan username baru</span>
              </div>
              <input defaultValue={user.username} onChange={(e)=>setUsername(e.target.value)} type="text" placeholder="Ex: clintonlombogia" className="input input-bordered w-full" required/>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Role Pengguna</span>
              </div>
              <select defaultValue={user.role} onChange={(e)=>{if(e.target.value==='user'||e.target.value==='admin') setRole(e.target.value)}} className="select select-bordered" required>
                <option value=''>-- Pilih role --</option>
                <option value='user'>User</option>
                <option value='admin'>Admin</option>
              </select>
            </label>
            <button className="btn btn-success btn-block mt-5" type="submit">Ubah</button>
          </form>

          <form style={{width: 320}} onSubmit={handlePasswordFormSubmit}>
            {patchPassError &&
            <div role="alert" className="alert alert-error flex flex-col items-start my-2">
              {patchPassError.map((err, i) => (
                <div key={i} className="flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{err.msg}</span>
                </div>
              ))}
            </div>
            }
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Masukkan password baru</span>
              </div>
              <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Ex: Clinton123" className="input input-bordered w-full" required/>
            </label>
            <button className="btn btn-primary btn-block mt-5" type="submit">Ganti Password</button>
          </form>
        </section>
      </div>
    </div>
  )

  if(isNotFound) return (
    <div role="alert" className="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Error 404. Toko tidak ditemukkan!</span>
    </div>
  )
}

export default AdminUsersUbah