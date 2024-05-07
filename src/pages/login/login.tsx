import { ChangeEvent, FormEvent, SyntheticEvent, useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import React from "react";
import { authService, setToken } from "../../services/authService";
import { useUserActions } from "@/stores/userStore";



const Login = () => {
  const [avatar, setAvatar] = useState<{
    file: File | undefined,
    url: string
  }>({
    file: undefined,
    url: "",
  });

  const {setIsLogin} = useUserActions();
  const [loading, setLoading] = useState(false);

  const handleAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    
    if (e.target.files && e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });   
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);

    // const fullname = formData.get("fullname") as string;
    // const email = formData.get("email") as string;
    // const password = formData.get("password") as string;


    // VALIDATE INPUTS
  

    // VALIDATE UNIQUE USERNAME
  

    try {
      // const response = await authService.register({email, password, fullname})
      const response = await authService.register(formData);
      var data = await response.json();
      console.log(data);
      if (!response.ok){

      }
      
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
      const response = await authService.login({email,password});
      const data = await response.json(); 
      if(response.ok && data.accessToken && data.refreshToken){
        setToken(data);
        setIsLogin(true);
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email"  defaultValue="mot@gmail.com"/>
          <input type="password" placeholder="Password" name="password"  defaultValue="123"/>
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
          <input type="email" placeholder="Email" name="email"/>
          <input type="password" placeholder="Password" name="password"/>
          <input type="text" placeholder="Fullname" name="fullname" />
          <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
