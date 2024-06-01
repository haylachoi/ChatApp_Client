import { v4 as uuidv4 } from 'uuid';
import {
  RawRoom,
  RoomData,
  UserIdType,
} from './types';

export const generatePublisher = <T>(subscriber: Map<string, T>) => {
  return {
    sub: (eventHandler: T) => {
      const key = uuidv4();
      subscriber.set(key, eventHandler);
      return key;
    },
    unsub: (key: string) => {
      subscriber.delete(key);
    },
  };
};
export const checkIfInView = (
  element: HTMLElement | undefined,
  viewport: HTMLElement | undefined,
) => {
  if (!element)
    return false;
  const rect = element.getBoundingClientRect();
  if (!rect) return false;
  const inView =
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      // viewportRef.current?.clientHeight ||
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <=
      // viewportRef.current?.clientWidth ||
      (window.innerWidth || document.documentElement.clientWidth);
  return inView;
};

export function debounce(fn: Function, delay: number) {
  let timer: number;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export const convertRawRoomToRoom = (
  rawRoom: RawRoom,
  currentUserId: UserIdType,
) => {
  try {
    const { roomMemberInfos, ...rest } = rawRoom;
    const index = roomMemberInfos.findIndex(
      (info) => info.user.id === currentUserId,
    );
    if (index === -1) {
      return;
    }
    const myRoomInfo = roomMemberInfos.splice(index, 1)[0];
    const room: RoomData = {
      ...rest,
      currentRoomMemberInfo: myRoomInfo,
      otherRoomMemberInfos: roomMemberInfos,
      chats: undefined,
    };

    if (room.isGroup) {
      room.name = room.groupInfo?.name;
      room.avatar = room.groupInfo?.avatar;
    } else {
      room.name = room.otherRoomMemberInfos[0].user.fullname;
      room.avatar = room.otherRoomMemberInfos[0].user.avatar;
    }
    return room;
  } catch (error) {
    console.log(error);
  }
};
declare global {
  interface String {
    toRGB(): string | number;
    toLightRGB(): string | number;
    toHSL(): string | number;
  }
}

String.prototype.toHSL = function () {
  var hash = 0;
  if (this.length === 0) return hash;
  for (var i = 0; i < this.length; i++) {
    hash = this.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return `hsl(${hash % 360}, 50%, 70%)`;
};
String.prototype.toRGB = function () {
  var hash = 0;
  if (this.length === 0) return hash;
  for (var i = 0; i < this.length; i++) {
    hash = this.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  var rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 255;
    rgb[i] = value;
  }
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
};

String.prototype.toLightRGB = function (factor: number = 1.2): string {
  // Tạo mã màu RGB từ chuỗi
  let hash = 0;
  if (this.length === 0) return 'rgb(0, 0, 0)';
  for (var i = 0; i < this.length; i++) {
    hash = this.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  var rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 255;
    rgb[i] = value;
  }

  // Kiểm tra xem màu là sáng hay tối
  const [r, g, b] = rgb.map((value) => value / 255);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const isLight = luminance > 0.5;

  // Nếu màu đã sáng, trả về màu RGB gốc
  if (isLight) {
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  }

  // Nếu màu tối, tăng độ sáng của nó
  const lighten = (value: number) =>
    Math.min(255, Math.floor((value < 20 ? value * 4 + 50 : value) * factor));
  const lightRGB = rgb.map(lighten);

  return `rgb(${lightRGB[0]}, ${lightRGB[1]}, ${lightRGB[2]})`;
};
