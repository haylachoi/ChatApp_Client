import {
  KeyboardEventHandler,
  LegacyRef,
  UIEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'

import { useUserStore } from '@/stores/userStore'

import { format } from 'timeago.js'
import React from 'react'
import { useRoomStore } from '@/stores/roomStore'
import { chatService } from '@/services/chatService'
import { roomService } from '@/services/roomService'
import useDebounce from '@/hooks/useDebouce'
import { useReactionsStore } from '@/stores/reactionStore'
import Message from './message/message'
import { PrivateRoom } from '@/libs/types'

const Chat = () => {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [img, setImg] = useState<{
    file: File | undefined,
    url: string | undefined
  }>()

  const [isInview, setIsInview] = useState(true)

  const [isFetchingPreviousMessage, setIsFetchingPreviousMessage] =
    useState(false)
  const [isFetchingNextMessage, setIsFetchingNextMessage] = useState(false)

  const { currentUser } = useUserStore()
  const {
    currentRoom,
    addMesageToRoom,
    replaceChats,
    updateFirstMessageId,
    addPreviousMesasges,
    addNextMesasges,
    updateLastMessage: updateLastMessageId,
  } = useRoomStore()

  const { reactions } = useReactionsStore()
  
  const chatViewportRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const firstUnseenMessageRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<(HTMLDivElement | null)[]>([]);

  const [scrollTop, setScrollTop] = useState(0);
  const [isGoToUnseenMessage, setIsGoToUnseenMessage] = useState(false);
  const isReceiverBlocked = false;
  const isCurrentUserBlocked = false;
  
  if (!currentRoom) {
    return null;;
  }
  
  const canFetchPreviewMessage =
    currentRoom.chats == undefined ||
    currentRoom.firstMessageId == undefined ||
    currentRoom.chats.length == 0
      ? undefined
      : +currentRoom.chats[0].id > +currentRoom.firstMessageId

  const canFetchNextMessage =
    currentRoom.chats == undefined ||
    currentRoom.lastMessageId == undefined ||
    currentRoom.chats.length == 0
      ? undefined
      : +currentRoom.chats[currentRoom.chats.length - 1].id <
        +currentRoom.lastMessageId
  const handleEmoji = (e: any) => {
    setText((prev) => prev + e.emoji)
    setOpen(false)
  }

  const handleImg: React.ChangeEventHandler<HTMLInputElement> | undefined = (e) => {
    const element = e.currentTarget;
    const files = e.currentTarget.files;
    if (!files) return;   

    chatService.sendImageMessage(files, currentRoom.id).then((result) => {

    }).catch((error: any) => {
      console.log(error)
    })
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> | undefined = (
    e,
  ) => {
    if (e.key == 'Enter') {
      handleSend()
    }
  }

  const handleGoToLast = () => {
    roomService
      .getNextPrivateMessages(
        currentRoom.id!,
        currentRoom.chats[currentRoom.chats.length - 1].id!,
        null,
      )
      .then((result) => {
        console.log(result)
      })
      .catch((error) => {})
  }

  const handleSend = async () => {
    if (text === '') return
    if (!currentRoom.friend?.id) return
    let imgUrl = null

    try {
      await chatService.sendPrivateMessage(currentRoom.friend.id, text)
    } catch (err) {
      console.log(err)
    } finally {
      setImg(undefined)

      setText('')
    }
  }
  const handleScroll: UIEventHandler<HTMLDivElement> | undefined = (e) => {
    const element = e.currentTarget
    let a = element.scrollTop
    let b = element.scrollHeight - element.clientHeight
    let c = a / b // c=0 => top top page, c =1 => end of page

    const isScrollDown = element.scrollTop > scrollTop

    if (
      a < 200 &&
      canFetchPreviewMessage &&
      !isFetchingPreviousMessage &&
      !isScrollDown
    ) {
      setIsFetchingPreviousMessage(true)
      roomService
        .getPreviousPrivateMessages(currentRoom.id!, currentRoom.chats[0].id!)
        .then((result) => {
          addPreviousMesasges(currentRoom.id!, result.data)
        })
        .catch((error) => {})
        .finally(() => {
          setTimeout(() => {
            setIsFetchingPreviousMessage(false)
          }, 100)
        })
    }
    if (
      a > b - 200 &&
      canFetchNextMessage &&
      !isFetchingNextMessage &&
      isScrollDown
    ) {
      setIsFetchingNextMessage(true)
      roomService
        .getNextPrivateMessages(
          currentRoom.id!,
          currentRoom.chats[currentRoom.chats.length - 1].id!,
        )
        .then((result) => {
          addNextMesasges(currentRoom.id!, result.data)
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          setTimeout(() => {
            // setIsFetchingPreviousMessage(false);
            setIsFetchingNextMessage(false)
          }, 100)
        })
    }

    setScrollTop(element.scrollTop)
  }

  useEffect(() => {
    const initChat = async () => {
     

      if ( currentRoom.firstMessageId === undefined) {     
        const result = await roomService.getFirstMessage(currentRoom.id);
        const message = result.data
        if (message) {
          updateFirstMessageId(currentRoom.id, message.id)
        }
      }

      if (currentRoom.id && currentRoom.chats.length < 1) {
        const result = await roomService.getSomePrivateMessages(currentRoom.id)
        const messages = result.data;
        replaceChats(currentRoom.id, messages)
      }
      
      if (currentRoom.firstUnseenMessageId) {
        firstUnseenMessageRef.current?.scrollIntoView({
          behavior: 'instant',
          block: 'center',
          inline: 'nearest',
        })
      } else if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'instant' })
      }
    }
    initChat()
  }, [currentRoom])

  useEffect(() => {
    const key = chatService.onReceiveMessage.sub((message) => {
      console.log(message)
      if (message.privateRoomId == currentRoom.id) {
        addMesageToRoom(message.privateRoomId, message)
        if (message.senderId == currentUser?.id) {
          lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
      }
    })

    return () => {
      chatService.onReceiveMessage.unsub(key)
    }
  }, [currentRoom])

  /// observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInview(entry.isIntersecting)
      },
      {
        root: chatViewportRef.current, // viewport
        rootMargin: '0px', // no margin
        threshold: 0.5, // 50% of target visible
      },
    )

    if (lastMessageRef.current) {
      observer.observe(lastMessageRef.current)
    }

    return () => {
      if (lastMessageRef.current) {
        observer.unobserve(lastMessageRef.current)
      }
    }
  }, [currentRoom.chats.length])

  /// observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement
          const id = element.dataset?.id
          if (id !== undefined && entry.isIntersecting) {
            chatService
              .updateSeenMessage(id)
              .then((result) => {
                observer.unobserve(entry.target)
              })
              .catch()
          }
        })
      },
      {
        root: chatViewportRef.current, // viewport
        rootMargin: '0px', // no margin
        threshold: 0.5, // 50% of target visible
      },
    )

    messagesRef.current?.map((el) => {
      if (el) {
        observer.observe(el)
      }
    })

    // Clean up the observer
    return () => {
      messagesRef.current?.map((el) => {
        if (el) {
          observer.unobserve(el)
        }
      })
    }
  }, [currentRoom.chats.length])


  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={currentRoom.friend?.avatar || './avatar.png'} alt="" />
          <div className="texts">
            <span>{currentRoom.friend?.fullname}</span>
            <p>Lorem ipsum dolor, sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center" onScroll={handleScroll} ref={chatViewportRef}>
        {currentRoom.chats &&
          currentRoom.chats.map((message, index) => (
            <Message
              key={message.id}
              index={index}
              message={message}
              lastMessageRef={lastMessageRef}
              messagesRef={messagesRef}
              firstUnseenMessageRef={firstUnseenMessageRef}
            />
          ))}
        {/* {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )} */}
        {/* <button className="go-to-last" onClick={handleGoToLast}>Go To</button> */}
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            multiple
            id="file"
            style={{ display: 'none' }}
            onChange={handleImg}
          />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? 'You cannot send a message'
              : 'Type a message...'
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}>
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat
