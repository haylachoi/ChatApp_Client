interface UserInfo {
    email: string,
    fullname: string
}

interface Token {
    accessToken: string,
    refreshToken: string
}

interface User {
    id: string | undefined;
    email: string;
    fullname: string | undefined;
    avatar: string;
    isOnline: boolean;
}

interface Message {
    id: string ;
    content: string;
    senderId: string;
    isImage: boolean;
    privateRoomId: string;
    createdAt: string | undefined;
    isReaded: boolean;
}
interface PrivateRoomInfo {
    userId: string,
    firstMessageId: string | undefined;
    firstUnseenMessageId: string | undefined;
    unseenMessageCount: number;
}
interface PrivateRoom {
    id: string;
    friend: User;
    previousLastMessageId: string | undefined;
    lastMessageId: string | undefined;
    firstMessageId: string | undefined;
    firstUnseenMessageId: string;
    lastUnseenMessage: Message | undefined;
    unseenMessageCount: number | undefined;
    privateRoomInfos: PrivateRoomInfo[]
    chats: Message[];
}

interface Emotion {
    id: number;
    name: string;
}
interface HubResponse<T> {
    isSuccess: boolean;
    data: T;
}