import { useNavigate } from "react-router-dom"
import useToken from "../../hooks/useToken"
import { useEffect, useState } from "react"
import { deletePendingProduk, deletePendingToko, getPendingProduk, getPendingToko, postApprovePendingProduk, postApprovePendingToko, postRejectPendingProduk, postRejectPendingToko } from "../../services/api"
import Navbar from "../../components/Navbar"
import formatCurrency from "../../utils/formatCurrency"

interface PendingTokoModel{
  id:number
  post_by:number
  post_by_username:string
  nama_toko:string
  daerah:string
  status:'pending'|'approved'|'rejected'
}

interface PendingProdukModel{
  id:number
  post_by:number
  post_by_username:string
  nama_produk:string
  harga:number
  description:string
  manfaat:string
  nama_toko:string
  daerah:string
  status:'pending'|'approved'|'rejected'
}

const AdminPendingData = ()=>{

  const token = useToken()
  const navigate = useNavigate()

  // PENDING TOKO/PRODUK STATE
  const [pendingToko,setPendingToko] = useState<PendingTokoModel[]>()
  const [pendingProduk,setPendingProduk] = useState<PendingProdukModel[]>()

  useEffect(()=>{
    if(token){
      getPendingToko(token)
        .then(res=>{
          if(res.status === 200) setPendingToko(res.data.data)
        })
      getPendingProduk(token)
        .then(res=>{
          if(res.status === 200) setPendingProduk(res.data.data)
        })
    }
  },[token])

  // APROVE/REJECT/DELETE PENDING TOKO LOGIC
  const approvePendingToko = (id:number)=>{
    if(window.confirm('Terima/Approve data toko ini?')){
      postApprovePendingToko(token,id)
        .then(res=>{
          if(res.status === 200) {
            window.alert('Berhasil approve data, Data telah terdaftar di database.')
            navigate(0)
          }
        })
        .catch(()=>window.alert('Gagal approve data!'))
    }
  }

  const rejectPendingToko = (id:number)=>{
    if(window.confirm('Tolak/Reject data toko ini?')){
      postRejectPendingToko(token,id)
        .then(res=>{
          if(res.status === 200) {
            window.alert('Berhasil reject data.')
            navigate(0)
          }
        })
        .catch(()=>window.alert('Gagal reject data!'))
    }
  }

  const deletePendingTokoFromList = (id:number)=>{
    if(window.confirm('Hapus data dari daftar?')){
      deletePendingToko(token,id)
        .then(res=>{
          if(res.status === 200) {
            window.alert('Berhasil menghapus data dari daftar.')
            navigate(0)
          }
        })
        .catch(()=>window.alert('Gagal hapus data!'))
    }
  }

  // APROVE/REJECT/DELETE PENDING PRODUK LOGIC
  const approvePendingProduk = (id:number)=>{
    if(window.confirm('Terima/Approve data produk ini?')){
      postApprovePendingProduk(token,id)
        .then(res=>{
          if(res.status === 200) {
            window.alert('Berhasil approve data, Data telah terdaftar di database.')
            navigate(0)
          }
        })
        .catch(()=>window.alert('Gagal approve data!'))
    }
  }

  const rejectPendingProduk = (id:number)=>{
    if(window.confirm('Tolak/Reject data produk ini?')){
      postRejectPendingProduk(token,id)
        .then(res=>{
          if(res.status === 200) {
            window.alert('Berhasil reject data.')
            navigate(0)
          }
        })
        .catch(()=>window.alert('Gagal reject data!'))
    }
  }

  const deletePendingProdukFromList = (id:number)=>{
    if(window.confirm('Hapus data dari daftar?')){
      deletePendingProduk(token,id)
        .then(res=>{
          if(res.status === 200) {
            window.alert('Berhasil menghapus data dari daftar.')
            navigate(0)
          }
        })
        .catch(()=>window.alert('Gagal hapus data!'))
    }
  }

  return (
    <div className='container mx-auto'>
      <Navbar />
      <div className="py-10">
        <section className="flex flex-col items-center gap-12">
          <h2 className="text-lg font-bold text-center"><span className="text-red-500">[ADMIN]</span> Data Toko yang sedang dalam status Pending</h2>
          <div className="overflow-x-auto self-stretch">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th style={{width: 60}}></th>
                  <th>Ditambahkan Oleh</th>
                  <th>Nama Toko</th>
                  <th>Daerah</th>
                  <th>Status</th>
                  <th style={{width: 200}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pendingToko && pendingToko.map((data, i) => (
                  <tr key={i}>
                    <th>{1+i}</th>
                    <td>{data.post_by_username} / {data.post_by}</td>
                    <td>{data.nama_toko}</td>
                    <td>{data.daerah}</td>
                    <td>
                      {data.status === 'pending' && <span className="btn btn-primary btn-xs" title="Menunggu persetujuan Admin">Pending</span>}
                      {data.status === 'approved' && <span className="btn btn-success btn-xs" title="Diterima. Data sudah terdaftar di database">Approved</span>}
                      {data.status === 'rejected' && <span className="btn btn-warning btn-xs" title="Ditolak">Rejected</span>}
                    </td>
                    {data.status === 'pending' &&
                      <td className="flex gap-2 flex-wrap items-center">
                        <button className="btn btn-success btn-sm" onClick={()=>approvePendingToko(data.id)}>
                          <span>
                            Terima
                          </span>
                        </button>
                        <button className="btn btn-error btn-sm" onClick={()=>rejectPendingToko(data.id)}>
                          <span>
                            Tolak
                          </span>
                        </button>
                      </td>
                    }
                    {data.status !== 'pending' &&
                      <td className="flex gap-2 flex-wrap">
                        <button className="btn btn-warning btn-sm" onClick={()=>deletePendingTokoFromList(data.id)}>
                          <span>
                            Hapus Dari Daftar
                          </span>
                        </button>
                      </td>
                    }
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="flex flex-col items-center gap-12" style={{marginTop: 120}}>
          <h2 className="text-lg font-bold text-center"><span className="text-red-500">[ADMIN]</span> Data Produk yang sedang dalam status Pending</h2>
          <div className="overflow-x-auto self-stretch">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th style={{width: 60}}></th>
                  <th>Ditambahkan Oleh</th>
                  <th>Nama Produk</th>
                  <th>Harga</th>
                  <th>Deskripsi</th>
                  <th>Manfaat</th>
                  <th>Ditambahkan di toko</th>
                  <th>Status</th>
                  <th style={{width: 200}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pendingProduk && pendingProduk.map((data, i) => (
                  <tr key={i}>
                    <th>{1+i}</th>
                    <td>{data.post_by_username} / {data.post_by}</td>
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
                    {data.status === 'pending' &&
                      <td className="flex gap-2 flex-wrap">
                        <button className="btn btn-success btn-sm" onClick={()=>approvePendingProduk(data.id)}>
                          <span>
                            Terima
                          </span>
                        </button>
                        <button className="btn btn-error btn-sm" onClick={()=>rejectPendingProduk(data.id)}>
                          <span>
                            Tolak
                          </span>
                        </button>
                      </td>
                    }
                    {data.status !== 'pending' &&
                      <td className="flex gap-2 flex-wrap">
                        <button className="btn btn-warning btn-sm" onClick={()=>deletePendingProdukFromList(data.id)}>
                          <span>
                            Hapus Dari Daftar
                          </span>
                        </button>
                      </td>
                    }
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

export default AdminPendingData