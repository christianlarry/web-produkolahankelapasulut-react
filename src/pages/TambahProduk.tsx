import { useEffect, useState } from "react"
import useToken from "../hooks/useToken"
import { deletePendingProduk, getPendingProdukByPostBy, getTokoById, postPendingProduk } from "../services/api"
import { jwtDecode } from "jwt-decode"
import Navbar from "../components/Navbar"
import { useNavigate, useParams } from "react-router-dom"
import { isAxiosError } from "axios"
import formatCurrency from "../utils/formatCurrency"

interface PendingProdukModel{
  id:number
  post_by:number
  nama_produk:string
  harga:number
  description:string
  manfaat:string
  nama_toko:string
  daerah:string
  status:'pending'|'approved'|'rejected'
}

const TambahProduk = ()=>{

  // MENGAMBIL PARAMTER ID PADA URL
  const {id} = useParams()
  if(isNaN(Number(id)) || Number(id)===0 || !id) return (
    <div role="alert" className="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Error 400. ID TOKO pada url tidak valid!</span>
    </div>
  )

  const navigate = useNavigate()
  const token = useToken()
  const [userPendingProduk,setUserPendingProduk] = useState<PendingProdukModel[]>()

  // STATE INPUT
  const [idToko,setIdToko] = useState<number>()
  const [namaProduk,setNamaProduk] = useState<string>()
  const [harga,setHarga] = useState<number>()
  const [description,setDescription] = useState<string>()
  const [manfaat,setManfaat] = useState<string>()

  // AMBIL DATA TOKO
  const [toko,setToko] = useState<{ id: number, nama_toko: string, daerah: string }>()
  useEffect(()=>{
    if(token){
      getTokoById(token,Number(id))
        .then(res=>{
          if(res.status === 200) setToko(res.data.data[0])
        })
    }
  },[token])

  useEffect(()=>{
    if(toko)setIdToko(toko.id)
  },[toko])

  // STATE ERROR MSG
  const [postError,setPostError] = useState<{msg:string,path:string}[]>()
  const [user,setUser] = useState<{id:number,username:string,role:string}>()

  useEffect(()=>{
    if(token){
      const userData = jwtDecode<{id:number,username:string,role:string}>(token)
      setUser(userData)
      getPendingProdukByPostBy(token,userData.id)
        .then(res=>{
          if(res.status === 200) setUserPendingProduk(res.data.data)
        })
    }
  },[token])

  const handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault()
    if(idToko&&namaProduk&&harga&&description&&manfaat&&window.confirm('Konfirmasi, Tambahkan data?')){
      postPendingProduk(token,{namaProduk,idToko,description,harga,manfaat})
        .then(res=>{
          if(res.status === 201){
            window.alert('Berhasil menambahkan data produk dengan status Pending. Menunggu persetujuan dari Admin...')
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

  const hapusPendingProduk = (id:number)=>{
    if(window.confirm('Apakah anda yakin untuk menghapus data dari daftar?')){
      deletePendingProduk(token,id)
        .then(res=>{
          if(res.status === 200) {
            window.alert('Berhasil menghapus data!')
            navigate(0)
          }
        })
        .catch((err)=>{
          console.log(err)
          window.alert('Gagal menghapus data!')
        })
    }
  }

  return (
    <div className="container mx-auto">
      <Navbar />
      <div className="py-10">
        <section className="flex flex-col items-center gap-12">
          <button className="btn btn-outline btn-error btn-sm" onClick={()=>navigate(-1)}>&lt; Kembali</button>
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold text-center">Tambahkan produk untuk toko <b>{toko && toko.nama_toko}</b></h2>
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
                <span className="label-text">Nama produk</span>
              </div>
              <input onChange={(e)=>setNamaProduk(e.target.value)} type="text" placeholder="Ex: Kelapa Muda" className="input input-bordered w-full" required/>
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Harga dari produk <b>{namaProduk}</b></span>
              </div>
              <input onChange={(e)=>setHarga(Number(e.target.value))} type="number" placeholder="Ex: 100000 = Rp.100.000,00" className="input input-bordered w-full" required/>
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Deskripsi <b>{namaProduk}</b></span>
              </div>
              <textarea required onChange={(e)=>setDescription(e.target.value)} className="textarea textarea-bordered h-24" placeholder="Deskripsi dari produk"></textarea>
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Manfaat <b>{namaProduk}</b></span>
              </div>
              <textarea required onChange={(e)=>setManfaat(e.target.value)} className="textarea textarea-bordered h-24" placeholder="Manfaat dari produk"></textarea>
            </label>
            <button className="btn btn-success btn-block mt-5" type="submit">Tambah</button>
          </form>
          <div className="overflow-x-auto self-stretch">
            <h2>Daftar produk yang ditambahkan{user && ` oleh ${user.username}`}. <span className="text-error">Maximal {(user &&user.role === 'admin') ? 'Unlimited':'5'}</span></h2>
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Nama Produk</th>
                  <th>Harga</th>
                  <th>Deskripsi</th>
                  <th>Manfaat</th>
                  <th>Ditambahkan di toko</th>
                  <th>Status</th>
                  <th>Hapus</th>
                </tr>
              </thead>
              <tbody>
                {userPendingProduk && userPendingProduk.map((data, i) => (
                  <tr key={i}>
                    <th>{1+i}</th>
                    <td>{data.nama_produk}</td>
                    <td>{formatCurrency(data.harga)}</td>
                    <td>{data.description?data.description:'-'}</td>
                    <td>{data.manfaat?data.manfaat:'-'}</td>
                    <td><b>{data.nama_toko}</b><br/>{data.daerah}</td>
                    <td>
                      {data.status === 'pending' && <span className="btn btn-primary btn-xs" title="Menunggu persetujuan Admin">Pending</span>}
                      {data.status === 'approved' && <span className="btn btn-success btn-xs" title="Diterima. Data sudah terdaftar di database">Approved</span>}
                      {data.status === 'rejected' && <span className="btn btn-warning btn-xs" title="Ditolak">Rejected</span>}
                    </td>
                    <td>
                      <button className="btn btn-error btn-sm" onClick={()=>hapusPendingProduk(data.id)}>
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

export default TambahProduk