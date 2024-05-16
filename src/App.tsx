import { useEffect, useState } from 'react';
import React from 'react';

import Login from './pages/login/login';
import Main from './pages/main/main';
import { authService } from './services/authService';
import {
  chatHub,
  roomHub,
  userHub,
} from './services/hubConnection';
import { useIsLogin, useAuthActions, useIsConnected } from './stores/authStore';
import { userService } from './services/userService';

// const App = () => {
//   useEffect(() => {
//     chatHub.start();
//   },[])
//   return <div></div>
// }
const App = () => {
  const [isFetching, setIsFetching] = useState(false);
  const isLogin = useIsLogin();
  const isConnected = useIsConnected();
  const { setIsLogin, setCurrentUser, setIsConnected } = useAuthActions();
 

  useEffect(() => {
    const start = async () => {
      try {
        setIsFetching(true)
        console.log("fetch user")
        const user = await userService.getProfile();
        
          setCurrentUser(user);
          setIsLogin(true)
        
      } catch (error) {
        console.log(error)
        setIsLogin(false)
      } finally {
        setIsFetching(false)
      }
    }  
      start()
  }, [isConnected])

  useEffect(() => {
    if (isLogin) {
      const connectSignalr = async () => {
        try {
          await chatHub.start()
          await Promise.all([
            userHub.start(),
            roomHub.start(),
          ])
          setIsConnected(true)
        } catch (error) {}
      }

      connectSignalr();
    }
  }, [isLogin])

  if (isFetching) return <div className="loading">Đang đăng nhập ....</div>
  if (isLogin && !isConnected) {
    return <div className="loading">Đang kết nối....</div>
  }

  return (
    <div className="container">
      {isLogin && <Main />}
      {!isLogin && <Login />}

      {/* <Notification /> */}
    </div>
  )
}

export default App
