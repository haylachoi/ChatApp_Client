
import { Token, UserInfo } from "@/libs/types";
import { REST_SEGMENT } from "../libs/constant"


const login = (data: {email : string, password: string}) => {
    const url = `${REST_SEGMENT.AUTH}/login`;
    const response = fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",         
          },
        body: JSON.stringify(data)
    })
    return response;
}


const register = (formData: FormData) => {
    const url = `${REST_SEGMENT.AUTH}/register`;
    const response = fetch(url, {
        method: "POST",       
        body: formData
    })
    return response;
}
const getProfile = () => {
    const url = `${REST_SEGMENT.AUTH}/profile`;
    const response = fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
    return response;
}
export const authService = {
    login,
    register,
    getProfile
}

export const setUserInfo = (user: UserInfo) => {
    const str = JSON.stringify(user);
    const code = btoa(str);
    localStorage.setItem("userInfo", code);
  }
  
  export const getUserInfo = () => {
    const code = localStorage.getItem("userInfo");
    if (code == null){
        return null;
    }
    const str = atob(code);
    return JSON.parse(str) as UserInfo;
  }
  
  export const clearUserInfo = () => {
    localStorage.removeItem("useInfo");
  }
  export const setToken = (token: Token) => {
    const str = JSON.stringify(token);
    const code = btoa(str);

    localStorage.setItem("token", code);
  };
  
  export const getAccessToken = () => {
    return getToken()?.accessToken;
  }
  export const getToken = () => {
    const code = localStorage.getItem("token");
    if (code == null){
        return null;
    }
    const str = atob(code);
    const token = JSON.parse(str) as Token;
    return token;
    
  };
  
  export const clearToken = () => {
    localStorage.removeItem("token");
  };