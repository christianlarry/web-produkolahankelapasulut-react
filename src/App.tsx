import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Beranda from './pages/Beranda'
import Register from './pages/Register'
import Login from './pages/Login'
import Produk from './pages/Produk'
import AdminUsers from './pages/Admin/AdminUsers/AdminUsers'
import AdminToko from './pages/Admin/AdminToko/AdminToko'
import AdminProduk from './pages/Admin/AdminProduk/AdminProduk'
import AdminContainer from './pages/Admin/AdminContainer'
import AdminUsersTambah from './pages/Admin/AdminUsers/AdminUsersTambah'
import AdminUsersUbah from './pages/Admin/AdminUsers/AdminUsersUbah'
import AdminTokoTambah from './pages/Admin/AdminToko/AdminTokoTambah'
import AdminTokoUbah from './pages/Admin/AdminToko/AdminTokoUbah'
import AdminProdukTambah from './pages/Admin/AdminProduk/AdminProdukTambah'
import AdminProdukUbah from './pages/Admin/AdminProduk/AdminProdukUbah'
import AdminTokoProduk from './pages/Admin/AdminToko/AdminTokoProduk'
import TambahToko from './pages/TambahToko'
import TambahProduk from './pages/TambahProduk'
import AdminPendingData from './pages/Admin/AdminPendingData'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Beranda/>}/>
        <Route path='/toko/tambah' element={<TambahToko/>}/>
        <Route path='/toko/:id/produk' element={<Produk/>}/>

        <Route path='/toko/:id/produk/tambah' element={<TambahProduk/>}/>
        
        <Route element={<AdminContainer/>}>
          <Route path='/admin/users' element={<AdminUsers/>}/>
          <Route path='/admin/users/tambah' element={<AdminUsersTambah/>}/>
          <Route path='/admin/users/:id/ubah' element={<AdminUsersUbah/>}/>

          <Route path='/admin/toko' element={<AdminToko/>}/>
          <Route path='/admin/toko/tambah' element={<AdminTokoTambah/>}/>
          <Route path='/admin/toko/:id/ubah' element={<AdminTokoUbah/>}/>
          <Route path='/admin/toko/:id/produk' element={<AdminTokoProduk/>}/>
          <Route path='/admin/toko/:id/produk/tambah' element={<AdminProdukTambah/>}/>

          <Route path='/admin/produk' element={<AdminProduk/>}/>
          <Route path='/admin/produk/:id/ubah' element={<AdminProdukUbah/>}/>

          <Route path='/admin/pending-data' element={<AdminPendingData/>}/>
        </Route>
        
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        
				<Route path='/*' element={<Navigate to={'/'}/>}/>
      </Routes>
    </Router>
  )
}

export default App
