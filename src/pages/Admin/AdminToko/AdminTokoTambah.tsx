import { useNavigate, useOutletContext } from "react-router-dom"
import Navbar from "../../../components/Navbar"
import { useState } from "react"
import { postToko } from "../../../services/api"
import { isAxiosError } from "axios"

const AdminTokoTambah = () => {

  const navigate = useNavigate()
  const {token} = useOutletContext<{token:string}>()

  // STATE INPUT
  const [namaToko,setNamaToko] = useState<string>()
  const [daerah,setDaerah] = useState<string>()

  // STATE ERROR MSG
  const [postError,setPostError] = useState<{msg:string,path:string}[]>()

  const handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault()
    if(namaToko && daerah && window.confirm('Konfirmasi, Tambahkan data?')){
      postToko(token,{namaToko,daerah})
        .then(res=>{
          if(res.status === 201){
            setPostError(undefined)
            if(e.target instanceof HTMLFormElement) e.target.reset()
            if(window.confirm('Berhasil menambahkan data toko, Kembali ke halaman daftar toko?')) return navigate('/admin/toko')
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
          <h2 className="text-lg font-bold text-center"><span className="text-red-500">[ADMIN]</span> Tambah Toko</h2>
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
                <span className="label-text">Masukkan nama toko</span>
              </div>
              <input onChange={(e)=>setNamaToko(e.target.value)} type="text" placeholder="Ex: Tong Tong" className="input input-bordered w-full" required/>
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Masukkan daerah dari toko</span>
              </div>
              <input onChange={(e)=>setDaerah(e.target.value)} type="text" placeholder="Ex: Malalayang, Manado" className="input input-bordered w-full" required/>
            </label>
            <button className="btn btn-success btn-block mt-5" type="submit">Tambah</button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default AdminTokoTambah