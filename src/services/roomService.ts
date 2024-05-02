import { HubResponse, Message, PrivateRoom, PrivateRoomInfo } from '@/libs/types';

import {privateRoomConnection} from "./hubConnection";
import { generatePublisher } from '@/libs/utils';

const subscribers = {
    createRoom: new Map<string, (room: PrivateRoom) => void>(),
  }
const getPrivateRooms = async () => {
    return privateRoomConnection
      .invoke('GetPrivateRooms');      
}

const createPrivateRoom = async (friendId: string) => {
    return privateRoomConnection
      .invoke('CreatePrivateRoom', friendId);      
}

const onCreateRoom = generatePublisher(subscribers.createRoom);

const canRoomDisplay = async (roomId: string, canDisplay: boolean): Promise<HubResponse<PrivateRoomInfo>> => {
    return privateRoomConnection.invoke("UpdateCanRoomDisplay", roomId, canDisplay);
}
const getSomePrivateMessages = async (roomId: string): Promise<HubResponse<Message[]>> => {
    return privateRoomConnection.invoke("GetSomePrivateMessages", roomId);
}

const getFirstMessage = async (roomId: string): Promise<HubResponse<Message>> => {
    return privateRoomConnection.invoke("GetFirstMessage", roomId);
}



const getNextPrivateMessages = async (roomId: string, messageId: string, numberMessage: number | null = 10) : Promise<HubResponse<Message[]>> => {
    return privateRoomConnection.invoke("GetNextPrivateMessages", roomId, messageId, numberMessage);
}

const getPreviousPrivateMessages = async (roomId: string, messageId: string, numberMessage: number | null = 10) : Promise<HubResponse<Message[]>> => {
    return privateRoomConnection.invoke("GetPreviousPrivateMessages", roomId, messageId, numberMessage);
}

privateRoomConnection.on("CreatePrivateRoom", room => {  
    subscribers.createRoom.forEach(eventHandler=> {
        eventHandler(room);
    })
})
export const roomService = {
    getSomePrivateMessages,
    getPrivateRooms,
    createPrivateRoom,
    updateCanMessageDisplay: canRoomDisplay,
    onCreateRoom,
    getFirstMessage: getFirstMessage,
    getNextPrivateMessages,
    getPreviousPrivateMessages,
}