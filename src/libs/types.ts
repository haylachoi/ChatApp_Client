
import { LucideIcon } from "lucide-react";


export interface UserInfo {
    email: string,
    fullname: string
}

export interface Token {
    accessToken: string,
    refreshToken: string
}

export interface User {
    id: string | undefined;
    email: string;
    fullname: string | undefined;
    avatar: string;
    isOnline: boolean;
}

export interface Message {
    id: string ;
    content: string;
    senderId: string;
    isImage: boolean;
    privateRoomId: string;
    createdAt: string | undefined;
    isReaded: boolean;
    reactionId: number | undefined;
}
export interface PrivateRoomInfo {
    userId: string,
    privateRoomId: string;
    firstMessageId: string | undefined;
    firstUnseenMessageId: string | undefined;
    canRoomDisplay: boolean;
    unseenMessageCount: number;
}
export interface PrivateRoom {
    id: string;
    friend: User;
    previousLastMessageId: string | undefined;
    lastMessageId: string | undefined;
    firstMessageId: string | undefined;
    firstUnseenMessageId: string;
    lastUnseenMessage: Message | undefined;
    unseenMessageCount: number | undefined;
    canRoomDisplay: boolean;
    privateRoomInfos: PrivateRoomInfo[]
    chats: Message[];
}

export interface Room {  
    id: string;
    name: string | undefined;
    isGroup: boolean;
    lastMessageId: string;
    firstMessageId: string;
    currentMemberInfo: RoomMemberInfo;
    roomMemberInfo: RoomMemberInfo[];
}

export interface RoomMemberInfo {
    memberId: string;
    fullName: string;
    firstUnseenMessageId: string;
    lastUnseenMessageId: string;
    unseenMessageCount: string;
    canDisplayRoom: boolean;
    canShowNotification: boolean;
    lastUnseenMessage: Message;
}
export interface Reaction {
    id: number;
    name: string;
    icon: LucideIcon;
}
export interface HubResponse<T> {
    isSuccess: boolean;
    data: T;
}

