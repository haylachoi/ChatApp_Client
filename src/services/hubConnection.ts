import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { BASE_WS_URL } from '../libs/constant'
import { getAccessToken } from './authService'

const chatHubUrl = `${BASE_WS_URL}/hub/chat`
const userHubUrl = `${BASE_WS_URL}/hub/user`
const roomHubUrl = `${BASE_WS_URL}/hub/room`
export const chatConnection = new HubConnectionBuilder()
  .withUrl(chatHubUrl, { accessTokenFactory: () => getAccessToken() ?? '' })
  .withAutomaticReconnect()
  .build()

  export const userConnection = new HubConnectionBuilder()
  .withUrl(userHubUrl, { accessTokenFactory: () => getAccessToken() ?? '' })
  .withAutomaticReconnect()
  .build()

  export const roomConnection = new HubConnectionBuilder()
  .withUrl(roomHubUrl, { accessTokenFactory: () => getAccessToken() ?? '' })
  .withAutomaticReconnect()
  .build()
