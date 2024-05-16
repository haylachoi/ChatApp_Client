import { ChangeEvent, FormEvent, SyntheticEvent, useEffect, useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import React from "react";
import { authService, setToken } from "../../services/authService";
import { useAuthActions } from "@/stores/authStore";




const Login = () => {
  const [avatar, setAvatar] = useState<{
    file: File | undefined,
    url: string
  }>({
    file: undefined,
    url: "",
  });

  const { setIsLogin } = useAuthActions();
  const [loading, setLoading] = useState(false);

  const handleAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      URL.revokeObjectURL(avatar.url);
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatar({
        file: e.target.files[0],
        url: url,
      });
    }
  };

  const handleRegister: React.FormEventHandler<HTMLFormElement> | undefined = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      // const response = await authService.register({email, password, fullname})
      const id = await authService.register(formData);
      e.currentTarget.reset();
      toast.success("Account created! You can login now!");
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

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
 useEffect(() => {
  return () => {
    URL.revokeObjectURL(avatar.url);
  }
 })
  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" defaultValue="mot@gmail.com" />
          <input type="password" placeholder="Password" name="password" defaultValue="123" />
          <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            name="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="email" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <input type="text" placeholder="Fullname" name="fullname" />
          <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
