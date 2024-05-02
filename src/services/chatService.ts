import { generatePublisher } from '@/libs/utils'
import { chatConnection } from './hubConnection'
import { Message, PrivateRoom } from '@/libs/types'
import { REST_SEGMENT } from '@/libs/constant'
import { getAccessToken } from './authService'

const subscribers = {
  receiveMessage: new Map<string, (message: Message) => void>(),
  updateSeenMessage: new Map<
    string,
    (message: Message, privateRoom: PrivateRoom) => void
  >(),
  updateReactionMessage: new Map<string, (message: Message) => void>(),
}

const sendImageMessage = async (files: FileList, roomId: string) => {
  const pathname = `${REST_SEGMENT.CHAT}`;
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  formData.append('roomId', roomId);

  return fetch(pathname, {
    method: 'POST',
    body: formData,
    headers: {
        "authorization": `Bearer ${getAccessToken()}`
    }
  })
}

const sendPrivateMessage = async (id: string, message: string) => {
  return chatConnection.send('SendPrivateMessage', id, message)
}

const updateSeenMessage = async (id: string) => {
  return chatConnection.send('UpdateSeenMessage', id)
}

const updateReactionMessage = async (
  messageId: string,
  reactionId: number | null,
) => {
  return chatConnection.send('updateReactionMessage', messageId, reactionId)
}

const onUpdateReactionMessage = generatePublisher(
  subscribers.updateReactionMessage,
)
const onReceiveMessage = generatePublisher(subscribers.receiveMessage)
const onUpdateSeenMessage = generatePublisher(subscribers.updateSeenMessage)

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

chatConnection.on('UpdateReactionMessage', (message) => {
  subscribers.updateReactionMessage.forEach((eventHandler) => {
    eventHandler(message)
  })
})

export const chatService = {
  sendPrivateMessage,
  sendImageMessage,
  onReceiveMessage,
  updateSeenMessage,
  onUpdateSeenMessage,
  updateReactionMessage,
  onUpdateReactionMessage,
}
