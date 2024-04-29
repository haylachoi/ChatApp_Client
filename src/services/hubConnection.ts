import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { BASE_WS_URL } from '../libs/constant'
import { getAccessToken } from './authService'

const chatHubUrl = `${BASE_WS_URL}/hub/chat`
const userHubUrl = `${BASE_WS_URL}/hub/user`
const privateRoomHubUrl = `${BASE_WS_URL}/hub/privateRoom`
export const chatConnection = new HubConnectionBuilder()
  .withUrl(chatHubUrl, { accessTokenFactory: () => getAccessToken() ?? '' })
  .withAutomaticReconnect()
  .build()



  export const userConnection = new HubConnectionBuilder()
  .withUrl(userHubUrl, { accessTokenFactory: () => getAccessToken() ?? '' })
  .withAutomaticReconnect()
  .build()

  export const privateRoomConnection = new HubConnectionBuilder()
  .withUrl(privateRoomHubUrl, { accessTokenFactory: () => getAccessToken() ?? '' })
  .withAutomaticReconnect()
  .build()
