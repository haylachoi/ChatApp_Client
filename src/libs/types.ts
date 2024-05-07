import { LucideIcon } from "lucide-react";


export interface UserInfo {
    email: string;
    fullname: string
}

export interface Token {
    accessToken: string;
    refreshToken: string
}

export interface User {
    id: string;
    email: string;
    fullname: string | undefined;
    avatar: string | undefined;
    isOnline: boolean;
}

export interface MessageData {
    id: string ;
    content: string;
    senderId: string;
    isImage: boolean;
    roomId: string;
    createdAt: string | undefined;
    messageDetails: MessageDetail[]
}
export interface MessageDetail {
    id: string;
    userId: string;
    messageId: string;
    reactionId: string;
    user: User
}
export interface PrivateRoomInfo {
    userId: string;
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
    lastUnseenMessage: MessageData | undefined;
    unseenMessageCount: number | undefined;
    canRoomDisplay: boolean;
    privateRoomInfos: PrivateRoomInfo[]
    chats: MessageData[];
}

export interface RawRoom {  
    id: string;
    name: string | undefined;
    isGroup: boolean;
    avatar: string | undefined;
    lastMessageId: string;
    firstMessageId: string;
    roomMemberInfos: RoomMemberInfo[];
}
export interface Room extends Omit<RawRoom, "roomMemberInfos"> {
    currentRoomMemberInfo: RoomMemberInfo;
    otherRoomMemberInfos: RoomMemberInfo[];
    chats : MessageData[] | undefined;
   
}

export interface RoomMemberInfo {
    userId: string;
    user: User;
    firstUnseenMessageId: string;
    lastUnseenMessageId: string;
    unseenMessageCount: string;
    canDisplayRoom: boolean;
    canShowNotification: boolean;
    lastUnseenMessage: MessageData;
    previousLastMessageId: string | undefined;  
}
export interface Reaction {
    id: string;
    name: string;
    icon: LucideIcon;
}

export interface HubResponse<T> {
    isSuccess: boolean;
    data: T;
    error: any;
}

