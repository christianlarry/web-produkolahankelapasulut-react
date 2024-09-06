import axios from "axios";

const baseUrl = 'http://localhost:5000/'

// TOKO -------------------------------------

export const getToko = (token:string,page:number=1,limit:number=25)=>{
  return axios.get(`${baseUrl}api/toko?page=${page}&limit=${limit}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getTokoById = (token:string,id:number)=>{
  return axios.get(`${baseUrl}api/toko/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getPendingToko = (token:string)=>{
  return axios.get(`${baseUrl}api/toko/pending`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getPendingTokoByPostBy = (token:string,id:number)=>{
  return axios.get(`${baseUrl}api/toko/pending/post-by/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const postPendingToko = (token:string,data:{namaToko:string,daerah:string})=>{
  return axios.post(`${baseUrl}api/toko/pending`,data,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const postApprovePendingToko = (token:string,id:number)=>{
  return axios.post(`${baseUrl}api/toko/pending/${id}/approve`,{},{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const postRejectPendingToko = (token:string,id:number)=>{
  return axios.post(`${baseUrl}api/toko/pending/${id}/reject`,{},{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const deletePendingToko = (token:string,id:number)=>{
  return axios.delete(`${baseUrl}api/toko/pending/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const searchToko = (token:string,search:string)=>{
  return axios.get(`${baseUrl}api/toko?search=${search}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const postToko = (token:string,data:{namaToko:string,daerah:string})=>{
  return axios.post(`${baseUrl}api/toko`,data,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const putToko = (token:string,id:number,data:{namaToko:string,daerah:string})=>{
  return axios.put(`${baseUrl}api/toko/${id}`,data,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const deleteToko = (token:string,id:number)=>{
  return axios.delete(`${baseUrl}api/toko/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// TOKO END -------------------------------------

// PRODUK -------------------------------------

export const getAllProduk = (token:string,page:number=1,limit:number=25)=>{
  return axios.get(`${baseUrl}api/produk?page=${page}&limit=${limit}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getProdukById = (token:string,id:number)=>{
  return axios.get(`${baseUrl}api/produk/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getPendingProduk = (token:string)=>{
  return axios.get(`${baseUrl}api/produk/pending`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getPendingProdukByPostBy = (token:string,id:number)=>{
  return axios.get(`${baseUrl}api/produk/pending/post-by/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const postPendingProduk = (token:string,data:{idToko:number,namaProduk:string,harga:number,description:string,manfaat:string})=>{
  return axios.post(`${baseUrl}api/produk/pending`,data,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const postApprovePendingProduk = (token:string,id:number)=>{
  return axios.post(`${baseUrl}api/produk/pending/${id}/approve`,{},{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const postRejectPendingProduk = (token:string,id:number)=>{
  return axios.post(`${baseUrl}api/produk/pending/${id}/reject`,{},{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const deletePendingProduk = (token:string,id:number)=>{
  return axios.delete(`${baseUrl}api/produk/pending/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const searchProduk = (token:string,search:string)=>{
  return axios.get(`${baseUrl}api/produk?search=${search}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getProdukByIdToko = (token:string,id:number)=>{
  return axios.get(`${baseUrl}api/toko/${id}/produk`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const postProduk = (token:string,data:{idToko:number,namaProduk:string,harga:number,description:string,manfaat:string})=>{
  return axios.post(`${baseUrl}api/produk`,data,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const putProduk = (token:string,id:number,data:{idToko:number,namaProduk:string,harga:number,description:string,manfaat:string})=>{
  return axios.put(`${baseUrl}api/produk/${id}`,data,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const deleteProduk = (token:string,id:number)=>{
  return axios.delete(`${baseUrl}api/produk/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// PRODUK END -------------------------------------

// AUTH -------------------------------------

export const postLogin = (data:{username:string,password:string})=>{
  return axios.post(`${baseUrl}login`,data)
}

export const postRegister = (data:{username:string,password:string})=>{
  return axios.post(`${baseUrl}register`,data)
}

export const postLogout = (token:string)=>{
  return axios.post(`${baseUrl}logout`,{},{headers:{
    Authorization: `Bearer ${token}`
  }})
}

export const checkToken = (token:string)=>{
  return axios.get(`${baseUrl}check-token`,{headers:{
    Authorization: `Bearer ${token}`
  }})
}

// AUTH END -------------------------------------

// USERS -------------------------------------

export const getUsers = (token:string)=>{
  return axios.get(`${baseUrl}api/user`,{headers:{
    Authorization: `Bearer ${token}`
  }})
}

export const getUserById = (token:string,id:number)=>{
  return axios.get(`${baseUrl}api/user/${id}`,{headers:{
    Authorization: `Bearer ${token}`
  }})
}

export const postUser = (token:string,data:{username:string,password:string,role:'admin'|'user'})=>{
  return axios.post(`${baseUrl}api/user`,data,{headers:{
    Authorization: `Bearer ${token}`
  }})
}

export const putUser = (token:string,id:number,data:{username:string,role:'admin'|'user'})=>{
  return axios.put(`${baseUrl}api/user/${id}`,data,{headers:{
    Authorization: `Bearer ${token}`
  }})
}

export const patchUserPassword = (token:string,id:number,data:{newPassword:string})=>{
  return axios.patch(`${baseUrl}api/user/password/${id}`,data,{headers:{
    Authorization: `Bearer ${token}`
  }})
}

export const deleteUser = (token:string,id:number)=>{
  return axios.delete(`${baseUrl}api/user/${id}`,{headers:{
    Authorization: `Bearer ${token}`
  }})
}

// USERS END -------------------------------------