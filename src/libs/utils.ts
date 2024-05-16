import { v4 as uuidv4 } from 'uuid'
import { RawRoom, Room } from './types';

export const generatePublisher= <T> (subscriber: Map<string, T>) => {
    return {
        sub: (eventHandler: T) => {
            const key = uuidv4()
            subscriber.set(key, eventHandler);
            return key;
        },
        unsub: (key: string) => {
            subscriber.delete(key)
          },
    }
}


export const convertRawRoomToRoom = (rawRoom: RawRoom, currentId: string) => {
    const {roomMemberInfos, ...rest} = rawRoom;
    const index = roomMemberInfos.findIndex(info => info.userId === currentId);

    if (index === -1) {
     return;
    }

    const myRoomInfo = roomMemberInfos.splice(index,1)[0];
    const room: Room = {...rest, currentRoomMemberInfo: myRoomInfo, otherRoomMemberInfos: roomMemberInfos, chats: undefined}
    return room;
}


