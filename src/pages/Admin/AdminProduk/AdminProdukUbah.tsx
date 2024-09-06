import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import Navbar from "../../../components/Navbar"
import { useEffect, useState } from "react"
import { getProdukById, putProduk } from "../../../services/api"
import { isAxiosError } from "axios"

interface ProdukModel{
  id:number
  id_toko:number
  nama_produk:string
  harga:number
  description:string
  manfaat:string
  nama_toko:string
  daerah:string
}

const AdminProdukUbah = () => {

  // MENGAMBIL PARAMTER ID PADA URL
  const {id} = useParams()
  if(isNaN(Number(id)) || Number(id)===0 || !id) return (
    <div role="alert" className="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Error 400. ID PRODUK pada url tidak valid!</span>
    </div>
  )

  const navigate = useNavigate()
  const {token} = useOutletContext<{token:string}>()

  // AMBIL DATA PRODUK YANG AKAN DIUBAH
  const [produk,setProduk] = useState<ProdukModel>()
	const [isNotFound,setIsNotFound] = useState<boolean>(false)

  useEffect(()=>{
    if(token){
      getProdukById(token,Number(id))
        .then(res=>{
          if(res.status === 200) {
						if(res.data.data.length === 0) return setIsNotFound(true)
						setProduk(res.data.data[0])
					}
        })
    }
  },[token])

  // STATE INPUT
  const [idToko,setIdToko] = useState<number>()
  const [namaProduk,setNamaProduk] = useState<string>()
  const [harga,setHarga] = useState<number>()
  const [description,setDescription] = useState<string>()
  const [manfaat,setManfaat] = useState<string>()

  useEffect(()=>{
    if(produk){
      setIdToko(produk.id_toko)
      setNamaProduk(produk.nama_produk)
      setHarga(produk.harga)
      setDescription(produk.description)
      setManfaat(produk.manfaat)
    }
  },[produk])

  // STATE ERROR MSG
  const [postError,setPostError] = useState<{msg:string,path:string}[]>()

  const handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault()
    if(idToko&&namaProduk&&harga&&description&&manfaat&& window.confirm('Konfirmasi, Ubah data?')){
      putProduk(token,Number(id),{namaProduk,manfaat,description,harga,idToko})
        .then(res=>{
          if(res.status === 200){
            setPostError(undefined)
            if(window.confirm('Berhasil mengubah data produk, Kembali ke halaman daftar produk?')) return navigate(`${produk?'/admin/toko/'+produk.id_toko+'/produk':'/admin/produk'}`)
          }
        })
        .catch(err=>{
          if(isAxiosError(err) && err.response && err.response.status === 400 && err.response.data.error.input){
            setPostError(err.response.data.error.input)
          }
        })
    }
  }

  if(produk) return (
    <div className="container mx-auto">
      <Navbar />
      <div className="py-10">
        <section className="flex flex-col items-center gap-12">
          <button className="btn btn-outline btn-error btn-sm" onClick={()=>navigate(-1)}>&lt; Kembali</button>
          <h2 className="text-lg font-bold text-center"><span className="text-red-500">[ADMIN]</span> Ubah Produk</h2>
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
              <input defaultValue={produk.nama_produk} onChange={(e)=>setNamaProduk(e.target.value)} type="text" placeholder="Ex: Kelapa Muda" className="input input-bordered w-full" required/>
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Harga dari produk <b>{namaProduk}</b></span>
              </div>
              <input defaultValue={produk.harga} onChange={(e)=>setHarga(Number(e.target.value))} type="number" placeholder="Ex: 100000 = Rp.100.000,00" className="input input-bordered w-full" required/>
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Deskripsi <b>{namaProduk}</b></span>
              </div>
              <textarea required defaultValue={produk.description} onChange={(e)=>setDescription(e.target.value)} className="textarea textarea-bordered h-24" placeholder="Deskripsi dari produk"></textarea>
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Manfaat <b>{namaProduk}</b></span>
              </div>
              <textarea required defaultValue={produk.manfaat} onChange={(e)=>setManfaat(e.target.value)} className="textarea textarea-bordered h-24" placeholder="Manfaat dari produk"></textarea>
            </label>
            <button className="btn btn-success btn-block mt-5" type="submit">Ubah</button>
          </form>
        </section>
      </div>
    </div>
  )

  if(isNotFound) return (
    <div role="alert" className="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Error 404. Produk tidak ditemukkan!</span>
    </div>
  )
}

export default AdminProdukUbah