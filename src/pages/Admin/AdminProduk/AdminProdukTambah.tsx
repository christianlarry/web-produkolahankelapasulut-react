import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import Navbar from "../../../components/Navbar"
import { useEffect, useState } from "react"
import { getTokoById, postProduk } from "../../../services/api"
import { isAxiosError } from "axios"

const AdminProdukTambah = ()=>{

  // MENGAMBIL PARAMTER ID PADA URL
  const {id} = useParams()
  if(isNaN(Number(id)) || Number(id)===0 || !id) return (
    <div role="alert" className="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Error 400. ID TOKO pada url tidak valid!</span>
    </div>
  )
  
  const navigate = useNavigate()
  const {token} = useOutletContext<{token:string}>()

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

  const handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault()
    if(idToko&&namaProduk&&harga&&description&&manfaat&& window.confirm('Konfirmasi, Tambahkan data?')){
      postProduk(token,{idToko,namaProduk,harga,description,manfaat})
        .then(res=>{
          if(res.status === 201){
            setPostError(undefined)
            if(e.target instanceof HTMLFormElement) e.target.reset()
            if(window.confirm('Berhasil menambahkan data produk, Kembali ke halaman daftar produk?')) return navigate(`/admin/toko/${Number(id)}/produk`)
          }
        })
        .catch(err=>{
          if(isAxiosError(err) && err.response && err.response.status === 400 && err.response.data.error.input){
            setPostError(err.response.data.error.input)
          }
        })
    }
  }

  if(toko) return (
    <div className="container mx-auto">
      <Navbar />
      <div className="py-10">
        <section className="flex flex-col items-center gap-12">
          <button className="btn btn-outline btn-error btn-sm" onClick={()=>navigate(-1)}>&lt; Kembali</button>
          <h2 className="text-lg font-bold text-center">
            <span className="text-red-500">[ADMIN]</span> Tambah Produk untuk toko <b>{toko.nama_toko}</b>
          </h2>
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
        </section>
      </div>
    </div>
  )
}

export default AdminProdukTambah