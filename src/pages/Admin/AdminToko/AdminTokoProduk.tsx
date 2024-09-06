import { useEffect, useState } from "react"
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom"
import { deleteProduk, getProdukByIdToko, getTokoById } from "../../../services/api"
import { isAxiosError } from "axios"
import Navbar from "../../../components/Navbar"
import formatCurrency from "../../../utils/formatCurrency"

interface ProdukModel{
  id:number
  id_toko:number
  nama_produk:string
  harga:number
  description?:string | null
  manfaat?:string | null
  nama_toko:string
  daerah:string
}

const AdminTokoProduk = ()=>{
  // MENGAMBIL PARAMTER ID PADA URL
  const {id} = useParams()
  if(isNaN(Number(id)) || Number(id)===0 || !id) return (
    <div role="alert" className="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Error 400. ID TOKO pada url tidak valid!</span>
    </div>
  )
  // GET DATA FROM AdminContainer
  const {token} = useOutletContext<{token:string}>()

  // AMBIL DATA TOKO
  const [toko,setToko] = useState<{ id: number, nama_toko: string, daerah: string }>()
	const [isNotFound,setIsNotFound] = useState<boolean>(false)

  const [produk, setProduk] = useState<ProdukModel[]>()
  
  const getAndSetProduk = () => {
    getProdukByIdToko(token, Number(id))
      .then(res => {
        if(res.status === 200) setProduk(res.data.data)
      })
      .catch(err => {
        if (isAxiosError(err)) console.log(err.message)
      })
  }

  useEffect(()=>{
    if(token) {
      getAndSetProduk()
      getTokoById(token,Number(id))
        .then(res=>{
          if(res.status === 200) setToko(res.data.data[0])
        })
        .catch(err=>{
          if(isAxiosError(err) && err.response && err.response.status === 404) setIsNotFound(true)
        })
    }
  },[token])

  const navigate = useNavigate()

  const hapusProduk = (id:number,namaProduk:string,namaToko:string)=>{
    if(window.confirm(`Hapus produk ${namaProduk} dari toko ${namaToko}?`)){
      deleteProduk(token,id)
        .then(res=>{
          if(res.status === 200){
            window.alert('Berhasil menghapus produk!')
            // REFRESH
            navigate(0)
          }
        })
        .catch(err=>{
          if(isAxiosError(err) && err.response && err.response.status === 404) return alert('Gagal menghapus produk, Produk tidak ditemukkan!')
          alert('Gagal menghapus produk, Terjadi kesalahan!')
        })
    }
  }

  if(toko) return (
    <div className='container mx-auto'>
      <Navbar />
      <div className="py-10">
        <section className="flex flex-col items-center gap-12">
          <button className="btn btn-outline btn-error btn-sm" onClick={()=>navigate(-1)}>&lt; Kembali</button>
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold text-center"><span className="text-red-500">[ADMIN]</span> Produk Olahan Kelapa yang dijual di toko <b>{toko.nama_toko}</b></h2>
            <span>{toko.daerah}</span>
          </div>
          <Link to='tambah' className="btn btn-outline btn-success">+ Tambah Produk</Link>
          <div className="overflow-x-auto self-stretch">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Nama Produk</th>
                  <th>Harga</th>
                  <th>Description</th>
                  <th>Manfaat</th>
                  <th style={{width: 200}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {produk && produk.map((data, i) => (
                  <tr key={i}>
                    <th>{i+1}</th>
                    <td>{data.nama_produk}</td>
                    <td>{formatCurrency(data.harga)}</td>
                    <td>{data.description?data.description:'-'}</td>
                    <td>{data.manfaat?data.manfaat:'-'}</td>
                    <td className="flex gap-2">
                      <button className="btn btn-warning btn-sm">
                        <Link to={`/admin/produk/${data.id}/ubah`}>
                          Ubah
                        </Link>
                      </button>
                      <button className="btn btn-error btn-sm" onClick={()=>hapusProduk(data.id,data.nama_produk,data.nama_toko)}>
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

  if(isNotFound) return (
    <div role="alert" className="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Error 404. Toko tidak ditemukkan!</span>
    </div>
  )
}

export default AdminTokoProduk