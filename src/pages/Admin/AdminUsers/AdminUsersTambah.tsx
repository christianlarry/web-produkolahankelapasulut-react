import { useNavigate, useOutletContext } from "react-router-dom"
import Navbar from "../../../components/Navbar"
import { useState } from "react"
import { postUser } from "../../../services/api"
import { isAxiosError } from "axios"

const AdminUsersTambah = () => {

  const navigate = useNavigate()
  const {token} = useOutletContext<{token:string}>()

  // STATE INPUT
  const [username,setUsername] = useState<string>()
  const [password,setPassword] = useState<string>()
  const [role,setRole] = useState<'user'|'admin'>()

  // STATE ERROR MSG
  const [postError,setPostError] = useState<{msg:string,path:string}[]>()

  const handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault()
    if(username && password && role && window.confirm('Konfirmasi, Tambahkan data?')){
      postUser(token,{username,password,role})
        .then(res=>{
          if(res.status === 201){
            setPostError(undefined)
            if(e.target instanceof HTMLFormElement) e.target.reset()
            if(window.confirm('Berhasil menambahkan user/pengguna, Kembali ke halaman daftar pengguna?')) return navigate('/admin/users')
          }
        })
        .catch(err=>{
          if(isAxiosError(err) && err.response && err.response.status === 400 && err.response.data.error.input){
            setPostError(err.response.data.error.input)
          }
        })
    }
  }

  return (
    <div className="container mx-auto">
      <Navbar />
      <div className="py-10">
        <section className="flex flex-col items-center gap-12">
          <button className="btn btn-outline btn-error btn-sm" onClick={()=>navigate(-1)}>&lt; Kembali</button>
          <h2 className="text-lg font-bold text-center"><span className="text-red-500">[ADMIN]</span> Tambah Users/Pengguna</h2>
          <form style={{width: 320}} onSubmit={handleSubmit}>
            {postError &&
            <div role="alert" className="alert alert-error flex flex-col items-start my-2">
              {postError.map((err, i) => (
                <div key={i} className="flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{err.path}: {err.msg}</span>
                </div>
              ))}
            </div>
            }
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Masukkan username</span>
              </div>
              <input onChange={(e)=>setUsername(e.target.value)} type="text" placeholder="Ex: clintonlombogia" className="input input-bordered w-full" required/>
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Masukkan password</span>
              </div>
              <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Ex: Clinton123" className="input input-bordered w-full" required/>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Role Pengguna</span>
              </div>
              <select onChange={(e)=>{if(e.target.value==='user'||e.target.value==='admin') setRole(e.target.value)}} className="select select-bordered" required>
                <option value=''>-- Pilih role --</option>
                <option value='user'>User</option>
                <option value='admin'>Admin</option>
              </select>
            </label>
            <button className="btn btn-success btn-block mt-5" type="submit">Tambah</button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default AdminUsersTambah