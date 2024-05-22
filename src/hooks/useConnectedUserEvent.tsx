import { userService } from '@/services/userService'
import { useEffect } from 'react'

const useConnectedUserEvent = () => {
    useEffect(() => { 
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
          Notification.requestPermission().then((per) => {
            if (per === 'granted') {
              var notification = new Notification('Thông báo', {
                body: message,
                icon: 'icon.jpg',
              })
            }
          })
        })
      
    }, [])
}

export default useConnectedUserEvent
