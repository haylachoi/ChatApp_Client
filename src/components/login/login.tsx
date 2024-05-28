import './login.css';
import { authService, setToken } from '@/services/authService';
import { useAuthActions } from '@/stores/authStore';
import { Loader, LoaderCircle } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const Login = () => {
  const { setIsLogin } = useAuthActions();
  const [loading, setLoading] = useState(false);

  
  const handleLogin: React.FormEventHandler<HTMLFormElement> | undefined = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const token = await authService.login({ email, password });
      setToken(token);
      setIsLogin(true);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div id="login-page" className="login">   
        <h2>Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" defaultValue="mot@gmail.com" />
          <input type="password" placeholder="Mật khẩu" name="password" defaultValue="123" />
          <a className="page-switcher" href="#register-page">Đăng ký tài khoản</a>
          <button disabled={loading}>{loading ? <LoaderCircle size={16} strokeWidth={4} className="spinner"/> : "Đăng nhập"}</button>
        </form>
      </div>
  )
}

export default Login
