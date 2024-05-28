import { HubResponse, MessageData, RawRoom, RoomMemberInfo } from '@/libs/types';
import {clientHub, roomHub} from "./hubConnection";
import { convertRawRoomToRoom, generatePublisher } from '@/libs/utils';

const connection = roomHub;
const eventListener = clientHub;
const subscribers = {
    joinRoom: new Map<string, (room: RawRoom) => void>(),
    leftRoom: new Map<string, (roomId: string) => void>(),
    updateFirstUnseenMessage: new Map<string, (roomMember: RoomMemberInfo) => void>()
  }
const getRooms = async (currentUserId: string) => {
    try {
        const result = await connection
          .invoke('GetRooms') as HubResponse<RawRoom[]>;  

        if (!result.isSuccess && !result.data) {
            return Promise.reject(result.error);
        }
        return result.data.map((rawRoom) => convertRawRoomToRoom(rawRoom, currentUserId)).filter((room) => !!room);
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

const createRoom = async (friendId: string) => {
    return connection
      .invoke('CreateRoom', friendId);      
}


const updateCanMessageDisplay = async (roomId: string, canDisplay: boolean): Promise<HubResponse<RoomMemberInfo>> => {
    return connection.invoke("UpdateCanRoomDisplay", roomId, canDisplay);
}

const updateFirstUnseenMessage = async (messageId: string): Promise<HubResponse<RoomMemberInfo>> => {
    return connection.invoke("UpdateFirstUnseenMessage", messageId);
}

const getSomeMessages = async (roomId: string): Promise<HubResponse<MessageData[]>> => {
    return await connection.invoke("GetSomeMessages", roomId) as HubResponse<MessageData[]>;
}

const getFirstMessage = async (roomId: string): Promise<HubResponse<MessageData>> => {
    return await connection.invoke("GetFirstMessage", roomId) as HubResponse<MessageData>;
}

const getNextMessages = async (roomId: string, messageId: string, numberMessage: number | null = 10) : Promise<HubResponse<MessageData[]>> => {
    return await connection.invoke("GetNextMessages", roomId, messageId, numberMessage) as HubResponse<MessageData[]>;
}

const getPreviousMessages = async (roomId: string, messageId: string, numberMessage: number | null = 10) : Promise<HubResponse<MessageData[]>> => {
    return await connection.invoke("GetPreviousMessages", roomId, messageId, numberMessage) as HubResponse<MessageData[]>;
}

const getMessagesFromTo = async (roomId: string, from: string, to: string) : Promise<HubResponse<MessageData[]>> => {
    return await connection.invoke("GetMessagesFromTo", roomId, from, to);
}
const onJoinRoom = generatePublisher(subscribers.joinRoom);
const onLeftRoom = generatePublisher(subscribers.leftRoom);
const onUpdateFirstUnseenMessage = generatePublisher(subscribers.updateFirstUnseenMessage);

eventListener.on("LeftRoom", (roomId: string) => {  
    subscribers.leftRoom.forEach(eventHandler=> {
        eventHandler(roomId);
    })
})

eventListener.on("JoinRoom", (room: RawRoom) => {  
    subscribers.joinRoom.forEach(eventHandler=> {
        eventHandler(room);
    })
})

eventListener.on("UpdateFirstUnseenMessage", (roomMember: RoomMemberInfo) => {  
    subscribers.updateFirstUnseenMessage.forEach(eventHandler=> {
        eventHandler(roomMember);
    })
})

export const roomService = {
    getSomeMessages,
    getRooms,
    createRoom,
    updateFirstUnseenMessage,
    updateCanMessageDisplay,
    getFirstMessage,
    getNextMessages,
    getPreviousMessages,
    getMessagesFromTo,

    onJoinRoom,
    onLeftRoom,
    onUpdateFirstUnseenMessage,
}