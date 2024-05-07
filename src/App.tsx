import { useEffect, useState } from 'react';
import React from 'react';

import Login from './pages/login/login';
import Main from './pages/main/main';
import { authService } from './services/authService';
import {
  chatConnection,
  roomConnection,
  userConnection,
} from './services/hubConnection';
import { useIsLogin, useUserActions } from './stores/userStore';

const App = () => {
  const [isFetching, setIsFetching] = useState(false);
  const isLogin = useIsLogin();
  const { setIsLogin, setCurrentUser } = useUserActions();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const start = async () => {
      try {
        setIsFetching(true)
        const response = await authService.getProfile()
        if (response.ok) {
          const data = await response.json()
          setCurrentUser(data)
          setIsLogin(true)
        }
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
          await chatConnection.start()
          await Promise.all([
            userConnection.start(),
            roomConnection.start(),
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
