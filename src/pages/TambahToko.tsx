import { useEffect, useState } from "react"
import useToken from "../hooks/useToken"
import { deletePendingToko, getPendingTokoByPostBy, postPendingToko } from "../services/api"
import { jwtDecode } from "jwt-decode"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"
import { isAxiosError } from "axios"

interface PendingTokoModel{
  id:number
  post_by:number
  nama_toko:string
  daerah:string
  status:'pending'|'approved'|'rejected'
}

const TambahToko = ()=>{

  const navigate = useNavigate()
  const token = useToken()
  const [userPendingToko,setUserPendingToko] = useState<PendingTokoModel[]>()

  // STATE INPUT
  const [namaToko,setNamaToko] = useState<string>()
  const [daerah,setDaerah] = useState<string>()

  // STATE ERROR MSG
  const [postError,setPostError] = useState<{msg:string,path:string}[]>()
  const [user,setUser] = useState<{id:number,username:string,role:string}>()

  useEffect(()=>{
    if(token){
      const userData = jwtDecode<{id:number,username:string,role:string}>(token)
      setUser(userData)
      getPendingTokoByPostBy(token,userData.id)
        .then(res=>{
          if(res.status === 200) setUserPendingToko(res.data.data)
        })
    }
  },[token])

  const handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault()
    if(namaToko && daerah && window.confirm('Konfirmasi, Tambahkan data?')){
      postPendingToko(token,{namaToko,daerah})
        .then(res=>{
          if(res.status === 201){
            window.alert('Berhasil menambahkan data toko dengan status Pending. Menunggu persetujuan dari Admin...')
            if(e.target instanceof HTMLFormElement) e.target.reset()
            navigate(0)
          }
        })
        .catch(err=>{
          if(isAxiosError(err) && err.response){
            if(err.response.status === 400) setPostError(err.response.data.error.input)
            if(err.response.status === 403 && err.response.data.error.message) alert(`Gagal menambah data. ${err.response.data.error.message}`)
          } 
        })
    }
  }

  const hapusPendingToko = (id:number)=>{
    if(window.confirm('Apakah anda yakin untuk menghapus data dari daftar?')){
      deletePendingToko(token,id)
        .then(res=>{
          if(res.status === 200) {
            window.alert('Berhasil menghapus data!')
            navigate(0)
          }
        })
        .catch(()=>window.alert('Gagal menghapus data!'))
    }
  }

  return (
    <div className="container mx-auto">
      <Navbar />
      <div className="py-10">
        <section className="flex flex-col items-center gap-12">
          <button className="btn btn-outline btn-error btn-sm" onClick={()=>navigate(-1)}>&lt; Kembali</button>
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold text-center">Tambahkan data toko yang menjual Produk Olahan Kelapa untuk dimasukkan ke database</h2>
            <span className="text-center" style={{maxWidth:800,textAlign:"justify"}}>Data yang akan ditambahkan nantinya tidak akan langsung terdaftar di database melainkan data tersebut akan dianggap pending yang mana data tersebut akan menunggu persetujuan dari admin.</span>
          </div>
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
          <div className="overflow-x-auto self-stretch">
            <h2>Daftar toko yang ditambahkan{user && ` oleh ${user.username}`}. <span className="text-error">Maximal {(user &&user.role === 'admin') ? 'Unlimited':'3'}</span></h2>
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Nama Toko</th>
                  <th>Daerah</th>
                  <th>Status</th>
                  <th>Hapus</th>
                </tr>
              </thead>
              <tbody>
                {userPendingToko && userPendingToko.map((data, i) => (
                  <tr key={i}>
                    <th>{1+i}</th>
                    <td>{data.nama_toko}</td>
                    <td>{data.daerah}</td>
                    <td>
                      {data.status === 'pending' && <span className="btn btn-primary btn-xs" title="Menunggu persetujuan Admin">Pending</span>}
                      {data.status === 'approved' && <span className="btn btn-success btn-xs" title="Diterima. Data sudah terdaftar di database">Approved</span>}
                      {data.status === 'rejected' && <span className="btn btn-warning btn-xs" title="Ditolak">Rejected</span>}
                    </td>
                    <td>
                      <button className="btn btn-error btn-sm" onClick={()=>hapusPendingToko(data.id)}>
                        Hapus
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

export default TambahToko