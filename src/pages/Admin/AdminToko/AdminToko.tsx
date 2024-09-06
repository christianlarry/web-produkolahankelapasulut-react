import { useEffect, useState } from "react"
import { deleteToko, getToko, searchToko } from "../../../services/api"
import {isAxiosError} from "axios"
import { Link, useNavigate, useOutletContext } from "react-router-dom"
import Navbar from "../../../components/Navbar"

type UsersRole = 'admin'|'user'

const AdminToko = () => {

  // GET DATA FROM AdminContainer
  const {token} = useOutletContext<{token:string,userRole:UsersRole}>()

  const [toko, setToko] = useState<{ id: number, nama_toko: string, daerah: string }[]>()
  const [pagination, setPagination] = useState<{ size: number, total: number, totalPages: number, current: string | number }>()
  const [isSearch, setIsSearch] = useState<boolean>(false)

  const [page, setPage] = useState<number>(1)

  const getAndSetToko = () => {
    getToko(token, page, 25)
      .then(value => {
        setToko(value.data.data)
        setPagination(value.data.page)
      })
      .catch(err => {
        if (isAxiosError(err)) {
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {

          }
        }
      })
  }

  const searchAndSetToko = (search: string) => {
    searchToko(token, search)
      .then(val => {
        setToko(val.data.data)
        setPagination(undefined)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    if (query.length > 2) {
      searchAndSetToko(query)
      return setIsSearch(true)
    }
    if (query.length === 0) {
      getAndSetToko()
      return setIsSearch(false)
    }
  }

  useEffect(() => {
    if (token && token != '') {
      getAndSetToko()
    }
  }, [page, token])

  const navigate = useNavigate()

  const hapusToko = (id:number,namaToko:string)=>{
    if(window.confirm(`Hapus toko ${namaToko}?`)){
      deleteToko(token,id)
        .then(res=>{
          if(res.status === 200){
            window.alert('Berhasil menghapus toko!')
            // REFRESH
            navigate(0)
          }
        })
        .catch(err=>{
          if(isAxiosError(err) && err.response && err.response.status === 404) return alert('Gagal menghapus toko, Toko tidak ditemukkan!')
          alert('Gagal menghapus toko, Terjadi kesalahan!')
        })
    }
  }

  return (
    <div className='container mx-auto'>
      <Navbar />
      <div className="py-10">
        <section className="flex flex-col items-center gap-12">
          <h2 className="text-lg font-bold text-center"><span className="text-red-500">[ADMIN]</span> Data Toko Produk Olahan Kelapa</h2>
          <div className="flex gap-5">
            <Link to='/admin/toko/tambah' className="btn btn-outline btn-success">+ Tambah Toko</Link>
            <input type="text" placeholder="Cari Toko" className="input input-bordered w-full max-w-xs" onChange={handleSearchInput} />
          </div>
          <div className="overflow-x-auto self-stretch">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Nama Toko</th>
                  <th>Daerah</th>
                  <th style={{width: 450}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {toko && toko.map((data, i) => (
                  <tr key={i}>
                    <th>{(((isSearch ? 1 : page) - 1) * 25 + 1) + i}</th>
                    <td>{data.nama_toko}</td>
                    <td>{data.daerah}</td>
                    <td className="flex gap-2 flex-wrap">
                      <Link className="btn btn-primary btn-sm" to={`/admin/toko/${data.id}/produk`}>
                        Lihat Produk
                      </Link>
                      <Link className="btn btn-success btn-sm" to={`/admin/toko/${data.id}/produk/tambah`}>
                        Tambah Produk
                      </Link>
                      <Link className="btn btn-warning btn-sm" to={`/admin/toko/${data.id}/ubah`}>
                        Ubah
                      </Link>
                      <button className="btn btn-error btn-sm" onClick={()=>hapusToko(data.id,data.nama_toko)}>
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

export default AdminToko