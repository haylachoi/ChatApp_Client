import { ChangeEvent, FormEvent, SyntheticEvent, useEffect, useState } from "react";
import "./auth.css";
import { toast } from "react-toastify";
import React from "react";
import { authService, setToken } from "../../services/authService";
import { useAuthActions } from "@/stores/authStore";
import Login from "@/components/auth/login/login";
import Register from "@/components/auth/register/register";

const Auth = () => {
  // const [avatar, setAvatar] = useState<string>('');
  
  // const { setIsLogin } = useAuthActions();
  // const [loading, setLoading] = useState(false);

  // const handleAvatar = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     URL.revokeObjectURL(avatar);
  //     const url = URL.createObjectURL(e.target.files[0]);
  //     setAvatar(url);
  //   }
  // };

  // const handleRegister: React.FormEventHandler<HTMLFormElement> | undefined = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const formData = new FormData(e.target as HTMLFormElement);

  //   try {
  //     const id = await authService.register(formData);
  //     console.log(id);
  //     e.currentTarget.reset();
  //     toast.success("Account created! You can login now!");
  //   } catch (err: any) {
  //     console.log(err);
  //     toast.error(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleLogin: React.FormEventHandler<HTMLFormElement> | undefined = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const formData = new FormData(e.currentTarget);
  //   const email = formData.get("email") as string;
  //   const password = formData.get("password") as string;

  //   try {
  //     const token = await authService.login({ email, password });
  //     setToken(token);
  //     setIsLogin(true);
  //   } catch (err: any) {
  //     console.log(err);
  //     toast.error(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
//  useEffect(() => {
//   return () => {
//     URL.revokeObjectURL(avatar);
//   }
//  })
  return (
    <div className="auth">
     
      <Login/>
      {/* <div className="separator"></div> */}
      <Register/>
     
    </div>
  );
};

export default Auth;
