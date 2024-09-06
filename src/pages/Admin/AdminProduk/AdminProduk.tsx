import { useEffect, useState } from "react"
import {isAxiosError} from "axios"
import { Link, useNavigate, useOutletContext } from "react-router-dom"
import Navbar from "../../../components/Navbar"
import { deleteProduk, getAllProduk, searchProduk } from "../../../services/api"
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

const AdminProduk = ()=>{

  // GET DATA FROM AdminContainer
  const {token} = useOutletContext<{token:string}>()

  const [produk, setProduk] = useState<ProdukModel[]>()
  const [pagination, setPagination] = useState<{ size: number, total: number, totalPages: number, current: string | number }>()
  const [isSearch, setIsSearch] = useState<boolean>(false)

  const [page, setPage] = useState<number>(1)

  const getAndSetProduk = () => {
    getAllProduk(token, page, 25)
      .then(value => {
        setProduk(value.data.data)
        setPagination(value.data.page)
      })
      .catch(err => {
        if (isAxiosError(err)) {
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {

          }
        }
      })
  }

  const searchAndSetProduk = (search: string) => {
    searchProduk(token, search)
      .then(val => {
        setProduk(val.data.data)
        setPagination(undefined)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    if (query.length > 2) {
      searchAndSetProduk(query)
      return setIsSearch(true)
    }
    if (query.length === 0) {
      getAndSetProduk()
      return setIsSearch(false)
    }
  }

  useEffect(() => {
    if (token && token != '') {
      getAndSetProduk()
    }
  }, [page, token])

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

  return (
    <div className='container mx-auto'>
      <Navbar />
      <div className="py-10">
        <section className="flex flex-col items-center gap-12">
          <h2 className="text-lg font-bold text-center"><span className="text-red-500">[ADMIN]</span> Data Seluruh Produk Olahan Kelapa</h2>
          <div className="flex gap-5">
            <Link to='/admin/toko/' className="btn btn-outline btn-success">+ Tambah Produk</Link>
            <input type="text" placeholder="Cari Produk" className="input input-bordered w-full max-w-xs" onChange={handleSearchInput} />
          </div>
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
                  <th>Toko</th>
                  <th style={{width: 200}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {produk && produk.map((data, i) => (
                  <tr key={i}>
                    <th>{(((isSearch ? 1 : page) - 1) * 25 + 1) + i}</th>
                    <td>{data.nama_produk}</td>
                    <td>{formatCurrency(data.harga)}</td>
                    <td>{data.description?data.description:'-'}</td>
                    <td>{data.manfaat?data.manfaat:'-'}</td>
                    <td><b>{data.nama_toko}</b><br/>{data.daerah}</td>
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
          {pagination &&
            <div className="join">
              <button className="join-item btn" onClick={() => setPage(page - 1)} disabled={page === 1 ? true : false}>«</button>
              <button className="join-item btn">Halaman {page}</button>
              <button className="join-item btn" onClick={() => setPage(page + 1)} disabled={page === pagination.totalPages ? true : false}>»</button>
            </div>
          }
        </section>
      </div>
    </div>
  )
}

export default AdminProduk