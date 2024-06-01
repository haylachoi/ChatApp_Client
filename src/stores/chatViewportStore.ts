import { RoomIdType } from "@/libs/types";


class ViewPortStore {
  public chatViewport?: HTMLElement;
  public firstUnseenMessage?: HTMLDivElement;
  public lastMessage?: HTMLDivElement;
  public unseenMessages: HTMLDivElement[] = [];
  public scrollTopCache: {
    roomId: RoomIdType,
    scrollTop: number
  }[] = []

  public resetCurrentViewPortStore = () => {
    this.chatViewport= undefined;
    this.firstUnseenMessage = undefined;
    this.lastMessage = undefined;
    this.unseenMessages = [];
  }

  public cacheScrollTop = (roomId: RoomIdType) => {
    const viewport = this.chatViewport;
   if (viewport) {
    const scrollTop = viewport.scrollTop;
    const cache = this.scrollTopCache.find(c => c.roomId === roomId);
    if (cache) {
      cache.scrollTop = scrollTop;
      return;
    }
    currentViewPortStore.scrollTopCache.push({
      roomId,
      scrollTop
    })
   }
  }
}
export const currentViewPortStore = new ViewPortStore();
