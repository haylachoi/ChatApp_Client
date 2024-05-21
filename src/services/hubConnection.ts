import { HubConnectionBuilder} from '@microsoft/signalr'
import { BASE_WS_URL } from '../libs/constant'
import {  getAccessToken } from './authService'
import Peer from 'peerjs'
import { v4 } from 'uuid'


const chatHubUrl = `${BASE_WS_URL}/hub/chat`
const userHubUrl = `${BASE_WS_URL}/hub/user`
const roomHubUrl = `${BASE_WS_URL}/hub/room`
const clientHubUrl = `${BASE_WS_URL}/hub/client`

export const chatHub = new HubConnectionBuilder()
  .withUrl(chatHubUrl, { accessTokenFactory: () => {
    console.log(getAccessToken());
    return getAccessToken() ?? ''
  } })
  .withAutomaticReconnect()
  .build()

export const userHub = new HubConnectionBuilder()
  .withUrl(userHubUrl, { accessTokenFactory: () => getAccessToken() ?? '' })
  .withAutomaticReconnect()
  .build()

export const roomHub = new HubConnectionBuilder()
  .withUrl(roomHubUrl, { accessTokenFactory: () => getAccessToken() ?? '' })
  .withAutomaticReconnect()
  .build()

export const clientHub = new HubConnectionBuilder()
  .withUrl(clientHubUrl, { accessTokenFactory: () => getAccessToken() ?? '' })
  .withAutomaticReconnect()
  .build()

// export const peerId = v4();
// export const peer = new Peer(peerId);