import { useEffect, useState } from 'react';
import React from 'react';

import Auth from './pages/auth/auth';
import Main from './pages/main/main';
import { chatHub, clientHub, roomHub, userHub } from './services/hubConnection';
import { useIsLogin, useAuthActions, useIsConnected, useCurrentUser } from './stores/authStore';
import { userService } from './services/userService';
import { getToken } from './services/authService';
import Notification from './components/ui/notification/notification';

const App = () => {
  const [isFetching, setIsFetching] = useState(false);
  const currentUser = useCurrentUser();
  const isLogin = useIsLogin();
  const isConnected = useIsConnected();
  const { setIsLogin, setCurrentUser, setIsConnected } = useAuthActions();

  useEffect(() => {
    const start = async () => {
      try {
        setIsFetching(true);
        console.log('fetch user');
        const user = await userService.getProfile();

        setCurrentUser(user);
        setIsLogin(true);    
      } catch (error) {
        console.log(error);
        setIsLogin(false);
      } finally {
        setIsFetching(false);
      }
    };
    
    if (getToken()) {
      start();
    }
  }, [isConnected]);

  useEffect(() => {
    const connectSignalr = async () => {
      try {
        const hubs = [clientHub, userHub, roomHub, chatHub].filter(hub => hub.state == 'Disconnected');

        await Promise.all(hubs.map(hub => hub.start()));
      
        setIsConnected(true);
      } catch (error) {
        console.log(error);
      }
    };
    if (isLogin) {
      connectSignalr();
    }
  }, [isLogin]);

  if (isFetching) return <div className="loading">Đang đăng nhập ....</div>;
  if (isLogin && !isConnected) {
    return <div className="loading">Đang kết nối....</div>;
  }

  return (
    <div className="container">
      {isLogin && <Main />}
      {!isLogin && <Auth />}

      <Notification />
    </div>
  );
};

export default App;
