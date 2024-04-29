import { useEffect, useState } from 'react'
import Detail from './components/ui/detail/Detail'
import List from './components/ui/sidebar/list'
import React from 'react'
import Login from './pages/login/login'
import { authService } from './services/authService'
import { useUserStore } from './stores/userStore'
import { chatConnection } from './services/hubConnection'
import { userService } from './services/userService'
import { useRoomStore } from './stores/roomStore'
import Chat from './components/ui/chat/chat'
import { chatService } from './services/chatService'

const App = () => {
  // const { chatId } = useChatStore();

  const [isFetching, setIsFetching] = useState(false)
  const { isLogin, setIsLogin, setCurrentUser, currentUser } = useUserStore()
  const [isConnected, setIsConnected] = useState(false)
  const { currentRoom, updateSeenMessage, updateLastMessage, addMesageToRoom } =
    useRoomStore()

  useEffect(() => {
    const start = async () => {
      try {
        setIsFetching(true)
        const response = await authService.getProfile()
        if (response.ok) {
          const data = await response.json();

          chatConnection
            .start()
            .then(() => setIsConnected(true))
            .catch((error) => {
              setIsConnected(false);
              console.log(error)
            })
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
    if( !isConnected) {
      start()
    }
  }, [isConnected, isConnected])

  useEffect(() => {
    if (isLogin) {
      // chatConnection
      //   .start()
      //   .then(() => setIsConnected(true))
      //   .catch((error) => {
      //     console.log(error)
      //   })
    }
  }, [isLogin])

  useEffect(() => {
    if (isConnected) {
      userService.onConnected((user) => {
        Notification.requestPermission().then((per) => {
          if (per === 'granted') {
            var notification = new Notification('Thông báo', {
              body: `${user.fullname} đã online`,
              icon: 'icon.jpg',
            })
          }
        })
      })
      userService.onDisconnected((message) => {
        console.log(message)
        Notification.requestPermission().then((per) => {
          if (per === 'granted') {
            var notification = new Notification('Thông báo', {
              body: message,
              icon: 'icon.jpg',
            })
          }
        })
      })
    }
  }, [isConnected])

  useEffect(() => {
    // chatService.onReceiveMessage((message) => {
    //   // console.log(message.id);
    //   updateLastMessage(message.privateRoomId, message);

    // })

    const key = chatService.onReceiveMessage.sub((message) => {
      // console.log(message.id);
      updateLastMessage(message.privateRoomId, message)
    })

    return () => {
      chatService.onReceiveMessage.unsub(key)
    }
  }, [])

  useEffect(() => {
    // chatService.onUpdateSeenMessage((message, privateRoom) => {
    //   console.log(privateRoom)
    //   updateSeenMessage(message.privateRoomId, message, privateRoom)
    // })

    const key = chatService.onUpdateSeenMessage.sub((message, privateRoom) => {
      console.log(privateRoom)
      updateSeenMessage(message.privateRoomId, message, privateRoom)
    });

    return () => {
      chatService.onUpdateSeenMessage.unsub(key);
    }
  }, [])

  if (isFetching) return <div className="loading">Loading...</div>
  if (isLogin && !isConnected)
    return <div className="loading">Connecting...</div>

  return (
    <div className="container">
      {isLogin && (
        <>
          <List />
          {currentRoom && <Chat />}
          {/* <Detail/> */}
        </>
      )}
      {!isLogin && <Login />}

      {/* <Notification /> */}
    </div>
  )
}

export default App
