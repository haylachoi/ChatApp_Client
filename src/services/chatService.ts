import { generatePublisher } from '@/libs/utils'
import { chatConnection } from './hubConnection'


const subscribers = {
  receiveMessage: new Map<string, (message: Message) => void>(),
  updateSeenMessage: new Map<
    string,
    (message: Message, privateRoom: PrivateRoom) => void
  >(),
}

const sendPrivateMessage = async (id: string, message: string) => {
  return chatConnection.send('SendPrivateMessage', id, message)
}

const updateSeenMessage = async (id: string) => {
  return chatConnection.send('UpdateSeenMessage', id)
}




// const onReceiveMessage = {
//   sub: (eventHandler: (message: Message) => void) => {
//     const key = uuidv4()
//     eventHanlderList.receiveMessageSubcribers.set(key, eventHandler)
//     return key
//   },
//   unsub: (key: string) => {
//     eventHanlderList.receiveMessageSubcribers.delete(key)
//   },
// }
const onReceiveMessage = generatePublisher(subscribers.receiveMessage);
const onUpdateSeenMessage = generatePublisher(subscribers.updateSeenMessage);
// const onUpdateSeenMessage = {
//   sub: (eventHandler: (message: Message, privateRoom: PrivateRoom) => void) => {
//     const key = uuidv4()
//     subscribers.updateSeenMessage.set(key, eventHandler)
//     return key
//   },
//   unsub: (key: string) => {
//     subscribers.updateSeenMessage.delete(key)
//   },
// }

// const onUpdateSeenMessage = (
//     eventHandler: (message: Message, privateRoom: PrivateRoom) => void,
// ) => {
//     chatConnection.on('UpdateSeenMessage', (message, privateRoom) => {
//         eventHandler(message, privateRoom)
//     })
// }

chatConnection.on('ReceivePrivateMessage', (message) => {
  subscribers.receiveMessage.forEach((eventHandler) => {
    eventHandler(message)
  })
})

chatConnection.on('UpdateSeenMessage', (message, privateRoom) => {
  subscribers.updateSeenMessage.forEach((eventHandler) => {
    eventHandler(message, privateRoom)
  })
})

export const chatService = {
  sendPrivateMessage,
  onReceiveMessage,
  updateSeenMessage,
  onUpdateSeenMessage,
}
