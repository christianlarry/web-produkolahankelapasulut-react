import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { postRegister } from "../services/api"
import axios from 'axios'

const Register = () => {
  const navigate = useNavigate()
  const [error, setError] = useState<{ type?: string, msg: string, path: string, location?: string }[]>()

  const [username,setUsername] = useState<string>()
  const [password,setPassword] = useState<string>()
  const [konfirmasiPassword,setKonfirmasiPassword] = useState<string>()

  const handleDaftar = (e:React.FormEvent) => {
    e.preventDefault()
    if (username && password && konfirmasiPassword) {

      if(password !== konfirmasiPassword) return setError([{msg:'Password dan konfirmasi password tidak sama',path: 'Password'}])

      postRegister({ username, password })
        .then(value => {
          if (value.status === 201) {
            window.alert('Berhasil register, Silahkan login')
            navigate('/login')
          }
        })
        .catch(err => {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 400) {
              setError(err.response.data.error.input)
            }
          }
        })
    }
  }

  return (
    <div className='container mx-auto'>
      <div className="flex flex-col items-center">
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 400 }} className="p-6 m-auto bg-white rounded-md shadow-md ring-2 ring-gray-800/50 lg:max-w-xl">
            <h1 className="text-3xl font-semibold text-center text-gray-700">Registrasi</h1>
            {error &&
            <div role="alert" className="alert alert-error flex flex-col items-start my-2">
              {error.map((err, i) => (
                <div key={i} className="flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{err.path}: {err.msg}</span>
                </div>
              ))}
            </div>
            }
            <form className="space-y-4" onSubmit={handleDaftar}>
              <div>
                <label className="label">
                  <span className="text-base label-text">Username</span>
                </label>
                <input onChange={(e)=>setUsername(e.target.value)} type="text" placeholder="Username" className="w-full input input-bordered" required />
              </div>
              <div>
                <label className="label">
                  <span className="text-base label-text">Password</span>
                </label>
                <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Masukkan Password"
                  className="w-full input input-bordered" required />
              </div>
              <div>
                <label className="label">
                  <span className="text-base label-text">Konfirmasi Password</span>
                </label>
                <input onChange={(e)=>setKonfirmasiPassword(e.target.value)} type="password" placeholder="Masukkan Password"
                  className="w-full input input-bordered" required />
              </div>
              <div>
                <button className="btn btn-block btn-primary" type="submit">Daftar</button>
              </div>
              <span>Sudah punya akun ?
                <Link to="/login" className="text-blue-600 hover:text-blue-800 hover:underline">Login</Link></span>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register