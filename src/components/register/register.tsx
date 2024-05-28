import './register.css';
import { authService } from '@/services/authService';
import { toast } from 'react-toastify';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react';

interface FormElements extends HTMLFormControlsCollection {
  fileInput: HTMLInputElement,
  emailInput: HTMLInputElement,
  passwordInput: HTMLInputElement,
  fullnameInput: HTMLInputElement
}

interface RegisterFormElement extends HTMLFormElement {
 readonly elements: FormElements
}
const Register = () => {
  const [avatar, setAvatar] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  

  const handleAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      URL.revokeObjectURL(avatar);
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatar(url);
    }
  };
  const handleRegister: React.FormEventHandler<RegisterFormElement> | undefined = async (e) => {
    e.preventDefault();
    setLoading(true);
    const element = e.currentTarget;
    const elements = e.currentTarget.elements;
    const files = elements.fileInput.files;
    const file = files && files[0];
    const email = elements.emailInput.value;
    const password = elements.passwordInput.value;
    const fullname = elements.fullnameInput.value;

    try {
      await authService.register({file, email, password, fullname}); 
      element.reset();
      toast.success("Đăng ký tài khoản thành công");
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(avatar);
    }
   });
  return (
    <div id="register-page"  className="register">
        <h2>Đăng ký tài khoản</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar || "./avatar.png"} alt="" />
            Tải ảnh
          </label>
          <input
            type="file"
            id="file"
            name="fileInput"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="email" placeholder="Email" name="emailInput" />
          <input type="password" placeholder="Mật khẩu" name="passwordInput" />
          <input type="text" placeholder="Họ tên" name="fullnameInput" />
          <a className="page-switcher" href="#login-page">Về trang đăng nhập</a>
          <button disabled={loading}>{loading ? <LoaderCircle size={16} strokeWidth={4} className="spinner"/> : <span>Đăng ký</span>}</button>
        </form>
      </div>
  )
}

export default Register
